import { actionTypes } from '../constants';

/**
 * Updates a node's labels.
 *
 * @param {Message} command - the pbjx command
 * @param {Object} config - the configuration for publishNodeFlow saga
 *
 * @returns {{pbj: {Message}, config: {Object} }}
 */
export default (command, config) => ({
  type: actionTypes.UPDATE_NODE_LABELS_REQUESTED,
  pbj: command,
  config,
});
