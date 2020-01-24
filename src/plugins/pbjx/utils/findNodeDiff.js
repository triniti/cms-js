/* eslint-disable no-param-reassign */
import { transform, isEqual, isObject, isArray } from 'lodash';

export const difference = (object, base) => transform(object, (result, value, key) => {
  // If object has etag then just compare etag
  if (isObject(value) && isObject(base[key]) && (value.etag !== base[key].etag)) {
    result[key] = value;
    return;
  }
  // If object is not blocks find any missing properties that were removed
  if (isObject(value) && isObject(base[key]) && key !== 'blocks') {
    const oldNodeKeys = Object.keys(base[key]);
    const newNodeKeys = Object.keys(value);
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));

    missingKeys.forEach((missingKey) => {
      value[missingKey] = '[removed]';
    });
  }
  if (!isEqual(value, base[key])) {
    result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
  }
});

export default (newNode, oldNode) => difference(newNode, oldNode);
