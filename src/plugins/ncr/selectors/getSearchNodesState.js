import isEmpty from 'lodash/isEmpty';

/**
 * @param {{ ncr }} state
 * @param {string} curie
 *
 * @returns {(Object|null)} - value in the state or null
 */
export default ({ ncr }, curie) => {
  const { searchNodes } = ncr;

  return !isEmpty(searchNodes) ? searchNodes[`${curie}`] : null;
};
