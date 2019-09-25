import { getFormValues } from 'redux-form';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';

import { formConfigs, formNames } from '../../constants';
import schemas from './schemas';

/**
 * @param formValues
 * @returns {*}
 */
function isTypeSelected(formValues) {
  return formValues && formValues.type && formValues.type.value;
}

/**
 * checks if content is selected from the Pickers
 *
 * @param formValues
 * @returns {*}
 */
function isContentSelected(formValues) {
  const type = formValues && formValues.type;

  if (!type) {
    return false;
  }

  if (type.value === formConfigs.CONTENT_TYPE.GENERAL_MESSAGE
    && formValues.body
    && formValues.body.length
  ) {
    return true;
  }

  return formValues && formValues.contentRefs && formValues.contentRefs.length;
}

/**
 * @param formValues
 * @returns {boolean}
 */
function isAppSelected(formValues) {
  return formValues && formValues.appRef && formValues.appRef.value;
}

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const getAllAppsRequestState = getRequest(state, schemas.getAllApps.getCurie());
  const { response } = getAllAppsRequestState;
  const formValues = getFormValues(formNames.CREATE_NOTIFICATION)(state);
  const contentHasValue = isContentSelected(formValues);
  let isCreateDisabled = true;

  if (isAppSelected(formValues) && isTypeSelected(formValues) && contentHasValue) {
    isCreateDisabled = false;
  }

  return {
    apps: response ? response.get('nodes') : [],
    formValues,
    getAllAppsRequestState,
    isCreateDisabled,
  };
};
