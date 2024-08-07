import camelCase from 'lodash-es/camelCase.js';
import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux';
import { withExtraArgument } from 'redux-thunk';
import ActionEvent from '@triniti/cms/events/ActionEvent.js';
import appReducer from '@triniti/cms/reducers/index.js';
import { serviceIds } from '@triniti/cms/constants.js';

/**
 * Broadcasts all actions through the app's dispatcher to
 * allow listeners outside of redux to respond.
 *
 * @param {App} app
 *
 * @returns {Function}
 */
const createBroadcastMiddleware = app => () => next => action => {
  const result = next(action);
  const event = new ActionEvent(app, action);
  const dispatcher = app.getDispatcher();
  dispatcher.dispatch('action:*', event).catch(console.error);
  dispatcher.dispatch(action.type, event).catch(console.error);
  return result;
};

/**
 * @param {App} app
 * @param {Object} preloadedState
 *
 * @returns {Object}
 */
export default async (app, preloadedState) => {
  const reducers = { app: appReducer };

  for (const plugin of app.getPlugins()) {
    if (plugin.hasReducer()) {
      reducers[camelCase(plugin.getName())] = plugin.getReducer();
    }
  }

  let composer;
  if (!app.getParameter('is_production')) {
    if (!app.has(serviceIds.REDUX_LOGGER_PREDICATE)) {
      app.set(serviceIds.REDUX_LOGGER_PREDICATE, () => true);
    }

    // for chrome / ff extensions setup
    const loggerPredicate = await app.get(serviceIds.REDUX_LOGGER_PREDICATE);
    composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ predicate: loggerPredicate })
      : compose;
  } else {
    composer = compose;
  }

  const middlewares = [withExtraArgument(app), createBroadcastMiddleware(app)];
  const enhancer = composer(applyMiddleware(...middlewares));
  const store = createStore(combineReducers(reducers), preloadedState, enhancer);
  app.set(serviceIds.REDUX_STORE, store);

  return store;
};
