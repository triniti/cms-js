import isPlainObject from 'lodash/isPlainObject';

/**
 * This will keep the whole object or list for a key. The reason is trying
 * to revert specific keys in a block list or multiselect list is difficult
 * because the data might have changed greatly. So we just put it back
 * completely to the original state.
 *
 * @param {Object} newNode
 * @param {Object} origNode
 */
export default (newNode, origNode) => {
  const newerNode = { ...newNode };
  Object.entries(newerNode).forEach((item) => {
    const [key, value] = item;
    if (Array.isArray(value) || isPlainObject(value)) {
      newerNode[key] = origNode[key];
    }
  });
  return newerNode;
};
