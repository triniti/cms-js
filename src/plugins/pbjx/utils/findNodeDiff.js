import { transform, isEqual, isObject } from 'lodash';

export const difference = (object, base) => transform(object, (result, value, key) => {
  // If object has etag then just compare etag
  if (isObject(value) && isObject(base[key]) && (value.etag !== base[key].etag)) {
    // Do not display etag in blocks
    delete value.etag;
    result[key] = value;
  }
  else if (!isEqual(value, base[key])) {
    result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
  }
});

export default (newNode, oldNode) => difference(newNode, oldNode);
