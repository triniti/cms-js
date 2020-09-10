import { all, call, put, select, take } from 'redux-saga/effects';
import { change, blur, getFormInitialValues, getFormValues, touch } from 'redux-form';
import isEqual from 'lodash/isEqual';
import swal from 'sweetalert2';

/**
 * Loop through each invalid fields to display invalid value and error message
 * @param invalidFields
 * @param localStorageFormValues
 * @param config
 */
function* restoreInvalidFields(invalidFields, localStorageFormValues, config) {
  const registeredFields = yield config.getRegisteredFields();

  for (let i = 0; i < invalidFields.length; i += 1) {
    const fieldName = invalidFields[i];
    const value = localStorageFormValues[fieldName];
    const registeredField = registeredFields[fieldName];
    if (!registeredField) {
      continue;
    }

    if (registeredField.type !== 'FieldArray') {
      yield put(blur(config.formName, fieldName, value));
      continue;
    }

    const fieldArrayValue = value || [];
    const fieldColumns = Object.keys(fieldArrayValue[0] || {});
    for (let rowIndex = 0; rowIndex < fieldArrayValue.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < fieldColumns.length; columnIndex += 1) {
        const column = fieldColumns[columnIndex];
        const fieldItemValue = value[rowIndex][column];
        const fieldItemName = `${fieldName}[${rowIndex}].${column}`;
        yield put(blur(config.formName, fieldItemName, fieldItemValue));
        yield put(touch(config.formName, fieldItemName));
      }
    }
  }
}

function* showAlert(title, message) {
  return yield swal.fire({
    title,
    html: `<strong>${message}</strong>`,
    showCancelButton: true,
    confirmButtonText: 'Resolve',
    cancelButtonText: 'Dismiss',
    confirmButtonClass: 'btn btn-primary',
    cancelButtonClass: 'btn btn-secondary',
  });
}

export default function* (config) {
  const localStorageForm = yield config.getFormData(config.formDataKey);
  config.clearFormData(config.formDataKey);

  if (!Object.keys(localStorageForm).length) {
    return;
  }

  const submittedValues = yield select(getFormValues(config.formName));
  const serializedValues = yield JSON.parse(JSON.stringify(submittedValues));
  const localValues = localStorageForm.values;

  // for some reason a value could not be save/persisted then it's invalid
  const unsavedFields = yield Object.keys(localValues)
    .filter((fieldName) => !isEqual(localValues[fieldName], serializedValues[fieldName])
      // exclude if comparing empty string to null
      && !(localValues[fieldName] === '' && serializedValues[fieldName] === null));

  const formErrors = yield Object.assign(
    localStorageForm.asyncErrors || {},
    localStorageForm.submitErrors,
    localStorageForm.syncErrors,
  );
  const invalidFields = yield [].concat(unsavedFields, Object.keys(formErrors))
    // filter duplicates
    .filter((fieldName, index, self) => self.indexOf(fieldName) === index);

  if (!invalidFields.length) {
    return;
  }

  yield take('@@redux-form/INITIALIZE');

  const alertTitle = config.shouldDisableSave ? 'Invalid updates found: ' : 'All updates have been saved, except:';
  const [result] = yield all([
    call(showAlert, alertTitle, invalidFields.sort().join(', ')),
    // invoke in parallel with showing alert since this can block
    // the UI if there are multiple invalid field arrays found.
    call(restoreInvalidFields, invalidFields, localValues, config),
  ]);

  if (!result.value) {
    const initialValues = yield select(getFormInitialValues(config.formName));
    for (let i = 0; i < invalidFields.length; i += 1) {
      const fieldName = invalidFields[i];
      const validValue = initialValues[fieldName];
      yield put(change(config.formName, fieldName, validValue));
    }
  }
}
