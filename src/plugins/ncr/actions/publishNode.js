import { actionTypes } from '../constants';

/**
 * Create a PUBLISH NODE REQUESTED action
 *
 * @param {Message} command - the pbjx command
 * @param {Object} config - the configuration for publishNodeFlow saga
 *
 * @returns {{pbj: {Message}, config: {Object} }}
 */
export default (command, config) => ({
  type: actionTypes.PUBLISH_NODE_REQUESTED,
  pbj: command,
  config,
});
