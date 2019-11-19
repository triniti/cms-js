/**
 * @param {Date|null} initialValue
 * @param {Date|null} currentValue
 * @return {boolean}
 */
const areDatesEqual = (initial, current) => {
  if ((initial && !current) || (!initial && current)) {
    return false;
  }
  if (initial === current) {
    return true;
  }
  return initial.toISOString() === current.toISOString();
};

export default areDatesEqual;
