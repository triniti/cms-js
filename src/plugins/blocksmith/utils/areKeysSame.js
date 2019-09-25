/**
 * Draft keys have two different forms - one used in the API (ContentBlock, ContentState, etc) and
 * one used in the DOM, which has "-0-0" appended. I got tired of keeping track of them while
 * comparing, so I made this to make it easier.
 *
 * @param {string} key1 - a draft key to compare
 * @param {string} key2 - a draft key to compare
 *
 * @returns {boolean}
 */

export default (key1, key2) => {
  const normalizedKey1 = key1.indexOf('-0-0') !== -1 ? key1 : `${key1}-0-0`;
  const normalizedKey2 = key2.indexOf('-0-0') !== -1 ? key2 : `${key2}-0-0`;
  return normalizedKey1 === normalizedKey2;
};
