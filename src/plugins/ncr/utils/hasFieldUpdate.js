import isEqual from 'lodash/isEqual';

const isEmpty = (value) => !value || !value.toString().trim().length;

const findEmptyFieldColumnValue = (value, initialValue, fieldType) => {
  if (fieldType !== 'FieldArray' || isEmpty(value)) {
    return null;
  }

  const fieldColumns = Object.keys(value[0] || {});
  for (let rowIndex = 0; rowIndex < value.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < fieldColumns.length; columnIndex += 1) {
      const column = fieldColumns[columnIndex];
      const fieldItemValue = value[rowIndex][column];
      if (initialValue) {
        const initialValueRow = initialValue[rowIndex] || [];
        const initialFieldItemValue = initialValueRow[column];
        if (initialFieldItemValue === '1' && fieldItemValue === '0') {
          return column;
        }
      }

      if (isEmpty(fieldItemValue)) {
        return column;
      }
    }
  }
  return null;
};

export default (formProps, invalidFields = []) => {
  const { initialValues, registeredFields = {}, values } = formProps;
  const updatedField = Object.keys(values)
    .find((fieldName) => !isEqual(values[fieldName], initialValues[fieldName])
      // exclude if comparing empty values
      && !(isEmpty(values[fieldName]) && isEmpty(initialValues[fieldName]))
      // exclude if it's a field array that contains an empty field column value
      && !findEmptyFieldColumnValue(values[fieldName], initialValues[fieldName], (registeredFields[fieldName] || {}).type)
      // exclude if field is an invalid field
      && !invalidFields.includes(fieldName));

  return !!updatedField;
};
