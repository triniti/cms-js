import { actionTypes } from '../constants';

/**
 * Create a DELETE NODE REQUESTED action
 *
 * @param {Message} command - the pbjx command
 * @param {Object} history - react-route history object prop from the component
 * @param {Object} config - the configuration for deleteNodeFlow saga
 *
 * @returns {{type: {String}, pbj: {Message}, config: {Object} }}
 */
export default (command, history, config) => ({
  type: actionTypes.DELETE_NODE_REQUESTED,
  pbj: command,
  history,
  config,
});
