import getCurrentNodeRef from '@triniti/cms/plugins/raven/selectors/getCurrentNodeRef.js';
import publishPbj from '@triniti/cms/plugins/pbjx/actions/publishPbj.js';

export default (pbj) => async (dispatch, getState, app) => {
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

