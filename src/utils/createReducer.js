import isEmpty from 'lodash-es/isEmpty.js';
import isPlainObject from 'lodash-es/isPlainObject.js';
import InvalidArgumentException from '@triniti/cms/exceptions/InvalidArgumentException.js';

/**
 * Creates a reducer which automatically calls the functions in the handlers
 * object based on the action type. Eliminates the sometimes messy switch.
 *
 * @param {*}      initialState - The initial state for this reducer.
 * @param {Object} handlers     - Keys are action types (strings), values are reducers (functions).
 *
 * @returns {Function} a reducer function
 *
 * @throws {InvalidArgumentException}
 */
export default (initialState, handlers) => {
  if (!isPlainObject(handlers) || isEmpty(handlers)) {
    throw new InvalidArgumentException('handlers is required and must be an object.');
  }

  return (state = initialState, action) => {
    if (!isPlainObject(action) || isEmpty(action)) {
      return state;
    }

    if (!action.type) {
      return state;
    }

    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  };
};
