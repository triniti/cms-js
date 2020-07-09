import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import { getFormValues } from 'redux-form';

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
    formValues: getFormValues(formName)(state),
    getHistoryRequestState,
    getUser,
    schema,
    streamId,
  };
};
