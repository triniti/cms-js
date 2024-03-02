import isPlainObject from 'lodash/isPlainObject';

/**
 * Removes "[removed]" entries from nodes changeset.
 */
const filterRemoved = (data) => {
  if (!isPlainObject(data)) {
    return data;
  }
  return Object.keys(data).reduce((accumulator, key) => {
    const value = data[key];
    if (value === '[removed]') {
      return accumulator;
    }
    if (Array.isArray(value)) {
      accumulator[key] = value.filter((v) => v !== '[removed]');
    } else if (isPlainObject(value)) {
      accumulator[key] = filterRemoved(value);
    } else {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
};

export default filterRemoved;