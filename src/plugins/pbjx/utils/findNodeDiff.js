/* eslint-disable no-param-reassign */
import { transform, isEqual, isObject } from 'lodash';

export const difference = (object, base) => transform(object, (result, value, key) => {
  // Find any properties that were removed so it can be displayed to user
  if (isObject(value) && isObject(base[key])) {
    const oldNodeKeys = Object.keys(base[key]);
    const newNodeKeys = Object.keys(value);
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));

    missingKeys.forEach((missingKey) => {
      value[missingKey] = '[removed]';
    });
  }
  // If object has etag then just compare etag
  if (isObject(value) && isObject(base[key]) && (value.etag !== base[key].etag)) {
    result[key] = value;
    return;
  }
  if (!isEqual(value, base[key])) {
    result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
  }
});

export default (newNode, oldNode) => difference(newNode, oldNode);
