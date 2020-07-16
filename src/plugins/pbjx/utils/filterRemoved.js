import isPlainObject from 'lodash/isPlainObject';

/**
 * Removes "[removed]" entries from nodes changeset.
 */
const filterRemoved = (data) => (
  Object.keys(data).reduce((accumulator, index) => {
    const value = data[index];
    if (value === '[removed]') {
      return accumulator;
    }
    if (Array.isArray(value)) {
      accumulator[index] = value.filter((v) => v !== '[removed]');
    } else if (isPlainObject(value)) {
      accumulator[index] = filterRemoved(value);
    } else {
      accumulator[index] = value;
    }

    return accumulator;
  }, {})
);

export default filterRemoved;
