import { actionTypes } from '@triniti/cms/plugins/pbjx/constants';

/**
 * @param {string} curie
 * @param {string} channel
 *
 * @returns {Object}
 */
export default (curie, channel = '') => ({
  type: actionTypes.REQUEST_CLEARED,
  curie,
  channel,
});
