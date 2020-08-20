import { actionTypes } from '../constants';

/**
 * This action will update the node with the new node. Useful
 * for the history revert functionality to update node.
 *
 * @param {SchemaCurie} curie
 * @param {String} channel
 */
export default (node, curie, channel = 'root') => ({
  type: actionTypes.UPDATE_RESPONSE_NODE,
  channel,
  curie,
  node,
});
