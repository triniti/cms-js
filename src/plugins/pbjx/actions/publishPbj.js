import { actionTypes } from 'plugins/pbjx/constants';

export default (pbj) => async (dispatch, getState, app) => {
  const pbjx = app.getPbjx();
  await pbjx.trigger(pbj, 'raven');
  return {
    type: actionTypes.FULFILLED,
  }
};
