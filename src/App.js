import isFunction from 'lodash-es/isFunction';
import Dispatcher from '@gdbots/pbjx/Dispatcher';
import LogicException from 'exceptions/LogicException';
import ServiceNotFound from 'exceptions/ServiceNotFound';
import createPbjx from 'createPbjx';
import createRedux from 'createRedux';
import startApp from 'actions/startApp';

const instances = new WeakMap();

const resolveService = async (app, resolver) => {
  const result = await (isFunction(resolver) ? resolver(app) : resolver);
  return result.default || result;
};

export default class App {
  /**
   * @param {Plugin[]} plugins
   * @param {Object}   preloadedState
   * @param {Function} pbjxCreator
   * @param {Function} reduxCreator
   */
  constructor(plugins = [], preloadedState = {}, pbjxCreator = createPbjx, reduxCreator = createRedux) {
    const instance = {
      parameters: new Map(),
      services: new Map(),
      resolved: new Map(),
      plugins: new Map(),
      dispatcher: new Dispatcher,
      preloadedState,
      pbjxCreator,
      reduxCreator,
      pbjx: null,
      redux: null,
      running: false,
    };

    instances.set(this, instance);
    plugins.forEach(plugin => instance.plugins.set(plugin.getName(), plugin));

    const parameters = instance.parameters;
    const appEnv = APP_ENV || 'dev';
    parameters.set('app_base_url', APP_BASE_URL || SITE_BASE_URL || '/');
    parameters.set('static_base_url', window.STATIC_BASE_URL || parameters.get('app_base_url'));
    parameters.set('pbjx_endpoint', PBJX_ENDPOINT || (parameters.get('app_base_url') + 'pbjx'));
    parameters.set('app_env', appEnv);
    parameters.set('app_vendor', APP_VENDOR);
    parameters.set('app_name', APP_NAME);
    parameters.set('app_version', APP_VERSION);
    parameters.set('app_build', APP_BUILD);
    parameters.set('app_deployment_id', APP_DEPLOYMENT_ID);
    parameters.set('app_dev_branch', APP_DEV_BRANCH || 'master');
    parameters.set(`is_${appEnv}_environment`, true);
    parameters.set('is_production', appEnv === 'prod' || appEnv === 'production');
    parameters.set('is_not_production', !parameters.get('is_production'));
  }

  /**
   * @param {string} name
   *
   * @returns {*}
   */
  getParameter(name) {
    return instances.get(this).parameters.get(name);
  }

  /**
   * @param {string} name
   * @param {*} value
   *
   * @returns {App}
   */
  setParameter(name, value) {
    instances.get(this).parameters.set(name, value);
    return this;
  }

  /**
   * @param {string} name
   *
   * @returns {boolean}
   */
  hasParameter(name) {
    return instances.get(this).parameters.has(name);
  }

  /**
   * Resolves a service by its id and returns it.
   *
   * @params {string} id
   *
   * @returns {*}
   *
   * @throws {ServiceNotFound}
   * @throws {LogicException}
   */
  async get(id) {
    const instance = instances.get(this);
    if (instance.resolved.has(id)) {
      return instance.resolved.get(id);
    }

    if (!this.has(id)) {
      throw new ServiceNotFound(id);
    }

    const resolver = instance.services.get(id);
    let service;

    try {
      service = await resolveService(this, resolver);
    } catch (e) {
      throw new LogicException(`Error resolving [${id}]: ${e.message}`);
    }

    instance.resolved.set(id, service);
    return service;
  }

  /**
   * @param {string} id
   * @param {Function} resolver - e.g. () => import('./path/to/my-service')
   *
   * @returns {App}
   */
  register(id, resolver) {
    instances.get(this).services.set(id, resolver);
    return this;
  }

  /**
   * @param {string} id
   * @param {Object|Function} service
   *
   * @returns {App}
   */
  set(id, service) {
    const instance = instances.get(this);
    instance.resolved.set(id, service);
    instance.services.set(id, Promise.resolve(service));
    return this;
  }

  /**
   * Returns true if the service has been registered or set on this app.
   *
   * `has(id)` returning true does not mean that `get(id)` will not throw an exception.
   * It does however mean that `get(id)` will not throw a `ServiceNotFound`.
   *
   * @params {string} id
   *
   * @returns {boolean}
   */
  has(id) {
    return instances.get(this).services.has(id);
  }

  /**
   * @param {string} eventName
   * @param {string} id
   * @param {?string} method
   *
   * @returns {Function} - Returns a function to unsubscribe
   */
  subscribe(eventName, id, method = null) {
    const listener = async (...args) => {
      const service = await this.get(id);
      return method ? service[method](...args) : service(...args);
    };
    const dispatcher = this.getDispatcher();
    dispatcher.addListener(eventName, listener);
    return () => {
      dispatcher.removeListener(eventName, listener);
    };
  }

  /**
   * @returns {Dispatcher}
   */
  getDispatcher() {
    return instances.get(this).dispatcher;
  }

  /**
   * @returns {Pbjx}
   *
   * @throws {LogicException}
   */
  getPbjx() {
    const instance = instances.get(this);
    if (!instance.running) {
      throw new LogicException('The Pbjx service has not been created yet.');
    }

    return instance.pbjx;
  }

  /**
   * @returns {Object}
   *
   * @throws {LogicException}
   */
  getRedux() {
    const instance = instances.get(this);
    if (!instance.running) {
      throw new LogicException('The Redux service has not been created yet.');
    }

    return instance.redux;
  }

  /**
   * @param {Function} selector
   * @param {Array} args to pass to the selector
   *
   * @returns {*}
   */
  select(selector, ...args) {
    return selector(this.getRedux().getState(), ...args);
  }

  /**
   * @param {string} name
   *
   * @returns {boolean}
   */
  hasPlugin(name) {
    return instances.get(this).plugins.has(name);
  }

  /**
   * @returns {Plugin[]}
   */
  getPlugins() {
    return Array.from(instances.get(this).plugins.values());
  }

  async configure() {
    // override in concrete app to configure
  }

  /**
   * Runs the "start" routine on the app:
   *
   * - calls "configure" on all plugins
   * - calls "configure" on the app instance
   * - creates the Pbjx service using the pbjxCreator
   * - creates the Redux service using the reduxCreator
   * - calls "start" on all plugins
   * - dispatches the "APP_STARTED" redux action
   *
   * Calling "start" when the app is already running is a noop.
   *
   * @returns {App}
   */
  async start() {
    const instance = instances.get(this);
    if (instance.running) {
      return this;
    }

    const plugins = this.getPlugins();
    await Promise.all(plugins.map(plugin => plugin.configure(this)));
    await this.configure();
    instance.pbjx = await instance.pbjxCreator(this);
    instance.redux = await instance.reduxCreator(this, instance.preloadedState);
    instance.running = true;
    await Promise.all(plugins.map(plugin => plugin.start(this)));
    await instance.redux.dispatch(startApp(this));

    return this;
  }

  /**
   * @returns {Object}
   */
  toObject() {
    const instance = instances.get(this);
    return {
      parameters: Object.fromEntries(instance.parameters),
      services: Array.from(instance.services.keys()),
      plugins: this.getPlugins().map(String),
    };
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }
}
