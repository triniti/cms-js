import { call } from 'redux-saga/effects';

/**
 * @param {App} app
 * @param {Object} action
 */
export default function* (app, action) {

  //const svc = yield call([app, 'get'], 'example');
  const pbjx = app.getPbjx();
  const response = yield call([pbjx, 'request'], action.pbj);
  console.log('pbjxtest', response.toObject());
  //console.log('svc', svc, action);
  //yield svc.onStuff({thing:'stuff'});
}
