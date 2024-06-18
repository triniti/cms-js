import { actionTypes } from '@triniti/cms/plugins/pbjx/constants.js';

// todo: refactor, not sure it's even needed, will decide once raven is reviewed
export default (pbj) => async (dispatch, getState, app) => {
  const pbjx = app.getPbjx();
  await pbjx.trigger(pbj, 'raven');
  return {
    type: actionTypes.FULFILLED,
  }
};
