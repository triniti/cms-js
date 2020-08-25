import { actionTypes } from '../constants';


/**
 * Create a MARK NODE AS PENDING REQUESTED action
 *
 * @param {Message} command - the pbjx command
 * @param {Object} config - the configuration for markNodeAsPendingFlow saga
 *
 * @returns {{type: {String}, pbj: {Message}, config: {Object} }}
 */
export default (command, config) => ({
  type: actionTypes.MARK_NODE_AS_PENDING_REQUESTED,
  pbj: command,
  config,
});
