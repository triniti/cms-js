import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the container.
 *
 * @returns {Object}
 */
export default (state, { schema, streamId }) => {
  const getHistoryRequestState = getRequest(state, schema.getCurie());
  const getUser = (messageRef) => getNode(state, NodeRef.fromMessageRef(messageRef));

  const { response } = getHistoryRequestState;
  const events = (response && response.get('events')) || [];

  const isRevertGranted = isGranted(state, 'cms-history-revert');

  return {
    events,
    getHistoryRequestState,
    getUser,
    isRevertGranted,
    schema,
    streamId,
  };
};
