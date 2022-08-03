import camelCase from 'lodash-es/camelCase';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import ActionEvent from 'events/ActionEvent';
import appReducer from 'reducers';
import { serviceIds } from 'constants';

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
  const sagas = [];

  app.getPlugins().forEach((plugin) => {
    if (plugin.hasReducer()) {
      reducers[camelCase(plugin.getName())] = plugin.getReducer();
    }

    if (plugin.hasSaga()) {
      sagas.push(plugin.getSaga());
    }
  });

  const middlewares = [thunk.withExtraArgument(app)];
  let sagaMiddleware;
  if (sagas) {
    sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);
  }

  middlewares.push(createBroadcastMiddleware(app));

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

  const enhancer = composer(applyMiddleware(...middlewares));
  const store = createStore(combineReducers(reducers), preloadedState, enhancer);
  app.set(serviceIds.REDUX_STORE, store);

  if (sagaMiddleware) {
    const rootSaga = function* createRootSaga() {
      yield all(sagas.map(saga => fork(saga, app)));
    };
    sagaMiddleware.run(rootSaga);
  }

  return store;
};
