import getCurrentNodeRef from 'plugins/raven/selectors/getCurrentNodeRef';
import publishPbj from 'plugins/pbjx/actions/publishPbj';

export default (pbj) => async (dispatch, getState) => {
  const state = getState();
  const currNodeRef = getCurrentNodeRef(state);

  if (
    !pbj.schema().hasMixin('gdbots:pbjx:mixin:event')
    // todo: Might not need the user check?
    && pbj.get('ctx_request_ref') === currNodeRef
  ) {
    return;
  }

  return dispatch(publishPbj(pbj));
};