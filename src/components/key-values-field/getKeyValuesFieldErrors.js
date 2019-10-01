import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import snakeCase from 'lodash/snakeCase';

/**
 * Gets all errors for a KeyValuesField in a redux form.
 *
 * @param {Object}  data            - The values of a KeyValuesField redux form state.
 * @param {string}  fieldName       - The fieldName for which to get errors.
 * @param {Node}    node            - The node to which the key-value pairs will be applied.
 * @param {string?} schemaFieldName - The schema field name to attempt to set, gathering any caught
 *                                    errors. Optional. If not supplied, fieldName will be
 *                                    snake_cased and used.
 *
 * @returns
 * {
 *   errors,
 *   hasError
 * }
 *  - The errors and whether or not there are any errors (an array of nulls is not a valid way of
 *    saying there are no errors).
 */

export default (data, fieldName, node, schemaFieldName = snakeCase(fieldName)) => {
  const field = node.schema().fields.get(schemaFieldName);
  const { pattern, type } = field;

  const errors = (data[fieldName] || []).map(({ key, value }) => {
    const error = {};
    if (!key) {
      error.key = 'Please enter a name';
    } else if (pattern && !pattern.test(key)) {
      error.key = `Name does not match pattern: ${pattern}`;
    }

    if (isNil(value)) {
      error.value = 'Please enter a value';
    } else if (pattern && !pattern.test(value)) {
      error.value = `Value does not match pattern: ${pattern}`;
    } else if (type && typeof type.guard === 'function') {
      try {
        type.guard(isObject(value) ? value.value : value, field);
      } catch (e) {
        error.value = e.getMessage();
      }
    }

    return Object.entries(error).length ? error : null;
  });

  return {
    errors,
    hasError: !!errors.find((error) => error),
  };
};
