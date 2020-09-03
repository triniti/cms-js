import { put, select } from 'redux-saga/effects';
import { blur, getFormValues } from 'redux-form';
import isEqual from 'lodash/isEqual';
import swal from 'sweetalert2';

export default function* (config) {
  const localStorageForm = yield config.getFormData(config.formName);
  config.clearFormData(config.formName);

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

  const values = localStorageForm.values;
  const result = yield swal.fire({
    title: 'All updates have been saved, except:',
    html: `<strong>${invalidFields.sort().join(', ')}</strong>`,
    showCancelButton: true,
    confirmButtonText: 'Resolve',
    cancelButtonText: 'Dismiss',
    confirmButtonClass: 'btn btn-primary',
    cancelButtonClass: 'btn btn-secondary',
  });

  if (result.value) {
    let i = 0;
    for (; i < invalidFields.length; i += 1) {
      const fieldName = invalidFields[i];
      const value = values[fieldName];
      yield put(blur(config.formName, fieldName, value));
    }
  }
}
