import getCurrentNodeRef from 'plugins/raven/selectors/getCurrentNodeRef';

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

  app.getPbjx().publish(pbj);

  return;
};