import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { actionTypes } from '@triniti/cms/plugins/raven/constants.js';
import PublishEvent from '@triniti/cms/plugins/raven/events/PublishEvent.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';

export default (worker, action) => async (dispatch, getState, app) => {
  const { nodeRef, pbj } = action;
  let event;

  try {
    event = await ObjectSerializer.deserialize(pbj);
    event.freeze();
  } catch (e) {
    console.error('raven/publishEvent deserialize failed', e.message, nodeRef, pbj);
    return;
  }

  const userRef = getUserRef(getState());
  const ctxUserRef = event.has('ctx_user_ref') ? NodeRef.fromMessageRef(event.get('ctx_user_ref')) : '';
  const isMine = `${userRef}` === `${ctxUserRef}`;

  const publishEvent = new PublishEvent(event, nodeRef, isMine);
  const dispatcher = app.getDispatcher();
  await dispatcher.dispatch('raven.event', publishEvent);
  await dispatcher.dispatch(`raven.${nodeRef}`, publishEvent);
  await app.getPbjx().publish(event);

  const data = { detail: { event, nodeRef, isMine } };
  worker.dispatchEvent(new CustomEvent('raven.event', data));
  worker.dispatchEvent(new CustomEvent(`raven.${nodeRef}`, data));
  dispatch({ type: actionTypes.EVENT_PUBLISHED, nodeRef, event, isMine });
};
