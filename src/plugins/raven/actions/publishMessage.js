import { actionTypes } from '../constants';

/**
 * Creates an action that will eventually be published
 * through Raven and consumed by all connected users.
 *
 * They will literally eat the message as per the
 * contract of the Raven... eversmores.
 *
 * @param {Object} message
 * @param {?string} topic
 *
 * @returns {Object}
 */
export default (message, topic = null) => ({
  type: actionTypes.PUBLISH_MESSAGE_REQUESTED,
  message,
  topic,
});
