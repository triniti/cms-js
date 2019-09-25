import { ravenTypes } from '../constants';
import publishMessage from './publishMessage';

/**
 * @param {string}  text
 * @param {?string} topic
 *
 * @returns {Object}
 */
export default (text, topic = null) => (
  publishMessage({ rt: ravenTypes.TEXT, text }, topic)
);
