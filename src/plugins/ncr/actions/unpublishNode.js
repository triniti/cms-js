import { actionTypes } from '../constants';

/**
 * Create a UNPUBLISH NODE REQUESTED action
 *
 * @param {Message} command - the pbjx command
 * @param {Object} config - the configuration for unpublishNodeFlow saga
 *
 * @returns {{type: {String}, pbj: {Message}, config: {Object} }}
 */
export default (command, config) => ({
  type: actionTypes.UNPUBLISH_NODE_REQUESTED,
  pbj: command,
  config,
});
