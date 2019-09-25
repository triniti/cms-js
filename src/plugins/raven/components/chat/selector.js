import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getMessages from '../../selectors/getMessages';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { nodeRef }) => ({
  isConnected: state.raven.connection.isConnected,
  isConnecting: state.raven.connection.isConnecting,
  wasRejected: state.raven.connection.wasRejected,
  messages: getMessages(state, nodeRef),
  getUser: (ref) => getNode(state, ref),
});
