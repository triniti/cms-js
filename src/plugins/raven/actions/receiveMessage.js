import { actionTypes } from '../constants';

/**
 * Creates an action from the message received from
 * Raven that will eventually be dispatched as a redux
 * action by a saga listening to this action.
 *
 * @param {Object} message
 * @param {?string} topic
 *
 * @returns {Object}
 */
export default (message, topic = null) => ({
  type: actionTypes.MESSAGE_RECEIVED,
  ts: Math.floor(Date.now() / 1000),
  isMe: false,
  fromLocal: false,
  message,
  topic,
});
