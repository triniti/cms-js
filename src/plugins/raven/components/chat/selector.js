import getNode from 'plugins/ncr/selectors/getNode';
import getMessages from 'plugins/raven/selectors/getMessages';
import isConnected from 'plugins/raven/selectors/isConnected';
import isConnecting from 'plugins/raven/selectors/isConnecting';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { nodeRef }) => ({
  isConnected: isConnected(state),
  isConnecting: isConnecting(state),
  messages: getMessages(state, nodeRef),
  getUser: (ref) => getNode(state, ref),
});