import transform from 'lodash-es/transform.js';
import isEqual from 'lodash-es/isEqual.js';
import isObject from 'lodash-es/isObject.js';

/**
 * @param {Object} targetObject
 * @param {Object} baseObject
 *
 * @returns {*}
 */
const difference = (targetObject, baseObject) => transform(targetObject, (result, value, key) => {
  const baseObjectValue = baseObject[key];

  // Find any properties that were removed so it can be displayed to user
  if (isObject(value) && isObject(baseObjectValue)) {
    const oldNodeKeys = Object.keys(baseObjectValue);
    const newNodeKeys = Object.keys(value);
    const missingKeys = oldNodeKeys.filter((oldNodeKey) => !newNodeKeys.includes(oldNodeKey));

    missingKeys.forEach((missingKey) => {
      value[missingKey] = '[removed]';
    });
  }

  // if etags are different, then just assign the new value
  if (isObject(value) && isObject(baseObjectValue) && (value.etag !== baseObjectValue.etag)) {
    result[key] = value;

    return;
  }

  if (!isEqual(value, baseObjectValue)) {
    result[key] = (isObject(value) && isObject(baseObjectValue))
      ? difference(value, baseObjectValue)
      : value;
  }
});

export default difference;
