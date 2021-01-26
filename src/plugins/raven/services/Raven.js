/* globals API_ENDPOINT, APP_VERSION */
/* eslint-disable no-underscore-dangle */
import startCase from 'lodash/startCase';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import md5 from 'md5';
import requestConnection from '../actions/requestConnection';
import openConnection from '../actions/openConnection';
import closeConnection from '../actions/closeConnection';
import connectUser from '../actions/connectUser';
import disconnectUser from '../actions/disconnectUser';
import receiveMessage from '../actions/receiveMessage';
import sendText from '../actions/sendText';

/**
 * Gets the URL that is needed to connect to the Raven
 * endpoint (an mqtt endpoint provided by Aws Iot).
 *
 * @param {string} apiEndpoint
 * @param {Object} accessToken
 *
 * @returns {Promise.<string>}
 */
async function getConnectUrl(apiEndpoint, accessToken) {
  const response = await fetch(`${apiEndpoint}/raven/connect/`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
  const data = await response.json();
  if (data && data.links && data.links.wss) {
    return data.links.wss;
  }
  return null;
}

export default class Raven {
  constructor(mqtt, store, apiEndpoint, appVendor, appName, appEnv) {
    this.mqtt = mqtt;
    this.store = store;
    this.apiEndpoint = apiEndpoint;
    // pbjx topics never come from "local" as they run within AWS
    const pbjxEnv = appEnv === 'local' ? 'dev' : appEnv;
    this.pbjxTopic = `${appVendor}-pbjx/${pbjxEnv}/#`;
    this.topic = `${appVendor}-${appName}/${appEnv}/`;
    this.client = null;
    this.connecting = false;
    this.prevErrorHash = '';
    window.onerror = this.onError.bind(this);
  }

  /**
   * @returns {boolean}
   */
  isConnected() {
    return this.client && this.client.connected;
  }

  /**
   * @returns {boolean}
   */
  isConnecting() {
    return this.connecting;
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#connect
   *
   * @returns {Promise}
   */
  async connect() {
    if (this.connecting) {
      console.info('raven::connecting');
      return;
    }

    if (this.isConnected()) {
      console.info('raven::already_connected');
      this.store.dispatch(openConnection());
      return;
    }

    const state = this.store.getState();
    const accessToken = getAccessToken(state);
    const userRef = getAuthenticatedUserRef(state);

    const disconnectMessage = disconnectUser().message;
    disconnectMessage.user = `${userRef}`;

    const options = {
      // clientId: may want to use hash of user ref + random here
      will: {
        topic: `${this.topic}general`,
        payload: JSON.stringify(disconnectMessage),
        qos: 0,
        retain: false,
      },
      // disable reconnect until transformWsUrl supports promises
      reconnectPeriod: 0,
    };

    this.connecting = true;
    this.store.dispatch(requestConnection());

    try {
      const url = await getConnectUrl(this.apiEndpoint, accessToken);
      if (!url) {
        this.connecting = false;
        this.client = null;
        console.error('raven::connect_failed::no_url');
        return;
      }
      this.client = this.mqtt.connect(url, options);
    } catch (e) {
      this.connecting = false;
      this.client = null;
      this.onError(e);
      console.error('raven::connect_failed', e);
      return;
    }
    this.client.subscribe([this.pbjxTopic, `${this.topic}#`]);

    this.client.on('message', (topic, message) => {
      this.connecting = false;
      let parsedMessage;

      try {
        parsedMessage = JSON.parse(`${message}`);
      } catch (e) {
        this.onError(e);
        console.error('raven::received_invalid_message', e, topic, message);
        return;
      }

      if (parsedMessage._schema) {
        try {
          const pbj = ObjectSerializer.deserialize(parsedMessage).freeze();
          if (!pbj.schema().hasMixin('gdbots:pbjx:mixin:event')) {
            console.error('raven::received_pbj_is_not_event', topic, message);
            return;
          }

          this.store.dispatch(pbj);

          // if we have a node_ref we'll also create a "TEXT" message
          // into the collaboration so users can see what happened.
          if (pbj.has('node_ref')) {
            const text = startCase(pbj.schema().getCurie().getMessage());
            const action = receiveMessage(sendText(text).message, pbj.get('node_ref').toString());
            action.ts = Math.floor(pbj.get('occurred_at').toDate() / 1000);
            action.message.user = pbj.has('ctx_user_ref')
              ? NodeRef.fromMessageRef(pbj.get('ctx_user_ref')).toString()
              : null;
            action.message.pbj = pbj;
            action.fromLocal = true;
            this.store.dispatch(action);
          }
          return;
        } catch (e) {
          this.onError(e);
          console.error('raven::received_invalid_pbj', e, topic, message);
          return;
        }
      }

      this.store.dispatch(receiveMessage(parsedMessage, topic.replace(this.topic, '')));
    });

    this.client.on('connect', () => {
      this.connecting = false;
      this.store.dispatch(openConnection());
      this.store.dispatch(connectUser());
    });

    this.client.on('close', () => {
      this.connecting = false;
      setTimeout(() => {
        this.client = null;
        this.store.dispatch(closeConnection());
      });
    });

    this.client.on('error', (err) => console.error('raven::error', err));
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#mqttclientendforce-cb
   */
  disconnect() {
    this.connecting = false;
    if (!this.isConnected()) {
      return;
    }

    try {
      this.store.dispatch(disconnectUser());
      this.client.end();
    } catch (e) {
      this.onError(e);
      console.error('raven::disconnect::error', e);
    }

    setTimeout(() => {
      this.client = null;
    });
  }

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
   *
   */
  onError(...args) {
    const state = this.store.getState();
    const accessToken = getAccessToken(state);
    const error = args.find((arg) => arg instanceof Error) || args[0];
    const logData = {
      app_version: APP_VERSION,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)).replaceAll('://', '[PROTOCOL_TOKEN]').replace(/(\/\.\.)+\/?/g, '[UP_DIRECTORY_TOKEN]'),
      request_uri: window.location,
    };
    const errorHash = md5(logData.error);

    if (
      isJwtExpired(accessToken)
      || window.location.hostname === 'localhost'
      || errorHash === this.prevErrorHash
    ) {
      return;
    }

    fetch(`${API_ENDPOINT}/raven/errors/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(logData),
    }).catch((e) => console.error('raven::onError::error', e));

    this.prevErrorHash = errorHash;
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#publish
   *
   * @param {Object}  message - message to publish (an object with rt key)
   * @param {?string} topic   - topic to publish
   */
  publish(message, topic = null) {
    const fullTopic = `${this.topic}${topic || 'general'}`;

    if (!this.isConnected()) {
      console.warn('raven::publish::not_connected', message, fullTopic);
      return;
    }

    try {
      this.client.publish(fullTopic, JSON.stringify(message));
    } catch (e) {
      this.onError(e);
      console.error('raven::publish::error', e, fullTopic, message);
    }
  }
}
