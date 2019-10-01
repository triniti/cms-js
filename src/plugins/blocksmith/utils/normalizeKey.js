/**
 * Draft keys have two different forms - one used in the API (ContentBlock, ContentState, etc) and
 * one used in the DOM, which has digits appended (eg "-0-0"). This function returns the API form.
 *
 * @param {string} key - a draft key to compare
 *
 * @returns {boolean}
 */

const DIGIT_REGEX = /-\d-\d/;
const API_KEY_REGEX = /^(\w|\d){1,5}$/;

export default (key) => {
  const normalizedKey = (DIGIT_REGEX.test(key) ? key.replace(DIGIT_REGEX, '') : key);
  if (!normalizedKey.match(API_KEY_REGEX)) {
    throw new Error(`Key [${key}] does not appear to be a valid ContentBlock key.`);
  }
  return normalizedKey;
};
