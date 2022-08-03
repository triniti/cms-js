/**
 * @param {Object} state
 * @param {string} curie
 * @param {string} channel
 *
 * @returns {?Object}
 */
export default ({ pbjx }, curie, channel = '') => {
  return pbjx[`${curie}${channel}`] || null;
};
