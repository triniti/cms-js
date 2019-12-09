import { actionTypes } from '../constants';

/**
 * Creates an action for a stop channel command that will be handled by the stopChannelFlow saga.
 *
 * @param {Message} command - A message using mixin 'triniti:ovp.medialive:command:stop-channel'
 *
 * @returns {Object}
 */
export default (command) => ({
  type: actionTypes.STOP_MEDIALIVE_CHANNEL_REQUESTED,
  pbj: command,
});
