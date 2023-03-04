import { ravenTypes } from 'plugins/raven/constants';
import publishMessage from 'plugins/raven/actions/publishMessage';

/**
 * @param {string}  text
 * @param {?string} topic
 *
 * @returns {Object}
 */
export default (text, topic = null) => (
  publishMessage({ rt: ravenTypes.TEXT, text }, topic)
);
