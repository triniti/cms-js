import { actionTypes } from '../constants';

/**
 * Creates an action for a start channel command that will be handled by the startChannelFlow saga.
 *
 * @param {Message} command - A message using mixin 'triniti:ovp.medialive:command:start-channel'
 *
 * @returns {Object}
 */
export default (command) => ({
  type: actionTypes.START_MEDIALIVE_CHANNEL_REQUESTED,
  pbj: command,
});
