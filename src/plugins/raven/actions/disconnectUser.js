import { actionTypes, ravenTypes } from '../constants';
import publishMessage from './publishMessage';

/**
 * @param {boolean} local - publish directly to redux, not through Raven
 *
 * @returns {Object}
 */
export default (local = false) => {
  if (local) {
    return {
      type: actionTypes.RT_USER_DISCONNECTED,
      ts: Math.floor(Date.now() / 1000),
      isMe: true,
      fromLocal: true,
    };
  }

  return publishMessage({ rt: ravenTypes.USER_DISCONNECTED });
};
