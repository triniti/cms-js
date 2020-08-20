import { actionTypes } from '../constants';

/**
 * Create a MARK NODE AS DRAFT REQUESTED action
 *
 * @param {Message} command - the pbjx command
 * @param {Object} config - the configuration for markNodeAsDraftFlow saga
 *
 * @returns {{type: {String}, pbj: {Message}, config: {Object} }}
 */
export default (command, config) => ({
  type: actionTypes.MARK_NODE_AS_DRAFT_REQUESTED,
  pbj: command,
  config,
});
