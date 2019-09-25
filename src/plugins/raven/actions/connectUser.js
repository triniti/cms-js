import { ravenTypes } from '../constants';
import publishMessage from './publishMessage';

/**
 * @returns {{topic, type, message}}
 */
export default () => (
  publishMessage({ rt: ravenTypes.USER_CONNECTED })
);
