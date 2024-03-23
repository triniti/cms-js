import getCurrentNodeRef from 'plugins/raven/selectors/getCurrentNodeRef';
import PbjxEvent from '@gdbots/pbjx/events/PbjxEvent';

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

  app.getDispatcher().dispatch(`${pbj.schema().getCurie()}`, new PbjxEvent(pbj));

  return;
};