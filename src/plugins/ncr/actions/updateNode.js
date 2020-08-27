import { actionTypes } from '../constants';

/**
 * Creates an action for an update node operation that
 * will be handled by the updateNodeFlow saga.
 *
 * @param {Message}  command - A message using mixin 'gdbots:ncr:mixin:update-node'
 * @param {Function} resolve - redux form promise resolver
 * @param {Function} reject  - redux form promise rejecter
 * @param {Object}   history
 * @param {Object}   match
 * @param {Object}   config
 *
 * @returns {Object}
 */
export default (command, resolve, reject, history, match, config = {}) => ({
  type: actionTypes.UPDATE_NODE_REQUESTED,
  pbj: command,
  resolve,
  reject,
  history,
  match,
  config,
});
