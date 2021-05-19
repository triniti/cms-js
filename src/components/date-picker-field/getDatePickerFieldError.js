import moment from 'moment';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import { DATE_FORMAT } from '@triniti/cms/components/date-picker-field';

/**
 * Gets errors for a DatePickerField in a redux form.
 *
 * @param {Object}  data            - The values of a TextField redux form state.
 * @param {string}  fieldName       - The fieldName for which to get errors.
 * @param {Node}    node            - The node to which the key-value pairs will be applied.
 * @param {string?} schemaFieldName - The schema field name to attempt to set, gathering any caught
 *                                    errors. Optional. If not supplied, fieldName will be
 *                                    snake_cased and used.
 *
 * @returns {string|null}
 */

export default (data, fieldName, node, schemaFieldName = snakeCase(fieldName)) => {
  const { required } = node.schema().fields.get(schemaFieldName);
  // eslint-disable-next-line react/destructuring-assignment
  const value = data[fieldName];

  if (!value) {
    if (required) {
      return `${startCase(fieldName)} is required.`;
    }
  } else if (moment(value, DATE_FORMAT, true).isValid()) {
    try {
      node.set(schemaFieldName, value);
    } catch (e) {
      return e.message;
    }
  } else {
    return `please enter a valid date in ${DATE_FORMAT} format.`;
  }

  return null;
};
