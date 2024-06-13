import { actionTypes } from '@triniti/cms/plugins/pbjx/constants.js';

export default (pbj) => async (dispatch, getState, app) => {
  const pbjx = app.getPbjx();
  await pbjx.trigger(pbj, 'raven');
  return {
    type: actionTypes.FULFILLED,
  }
};
