import { isDirty } from 'redux-form';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the container.
 *
 * @returns {Object}
 */
export default (state, { schema, streamId, formName }) => {
  const getHistoryRequestState = getRequest(state, schema.getCurie());
  const getUser = (messageRef) => getNode(state, NodeRef.fromMessageRef(messageRef));

  const { response } = getHistoryRequestState;
  const events = (response && response.get('events')) || [];

  return {
    events,
    getHistoryRequestState,
    getUser,
    isFormDirty: isDirty(formName)(state),
    schema,
    streamId,
  };
};
