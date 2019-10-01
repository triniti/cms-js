/**
 * Certain tests (eg race with delay) create anonymous functions that cannot be compared using
 * deepEqual.
 *
 * @param {*} actual
 * @param {*} expected
 */
const sagaDeepEqual = (actual, expected) => {
  if (typeof actual !== typeof expected) {
    return false;
  }
  let areEqual = false;
  switch (typeof actual) {
    case 'function':
      return actual.name === expected.name;
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return actual === expected;
    case 'object':
      if (actual === null) {
        return actual === expected;
      }
      if (Object.keys(actual).length !== Object.keys(expected).length) {
        return false;
      }
      if (Object.keys(actual).length === 0) {
        return true;
      }
      for (let i = 0; i < Object.keys(actual).length; i += 1) {
        if (Object.keys(actual)[i] !== Object.keys(expected)[i]) {
          return false;
        }
        areEqual = sagaDeepEqual(
          actual[Object.keys(actual)[i]],
          expected[Object.keys(expected)[i]],
        );
        if (!areEqual) {
          break;
        }
      }
      return areEqual;
    default:
      return false;
  }
};

export default sagaDeepEqual;
