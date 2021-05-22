import { getFormValues } from 'redux-form';
import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import getBlocksmith from '@triniti/cms/plugins/blocksmith/selectors/getBlocksmith';

import { formNames } from '../../constants';
import schemas from './schemas';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => {
  const updateScreen = updateScreenSelector(state, ownProps, {
    schemas,
    formName: formNames.PERSON,
  });

  const blocksmithState = getBlocksmith(state, formNames.PERSON);
  if (blocksmithState) {
    updateScreen.isSaveDisabled = updateScreen.isSaveDisabled && !blocksmithState.isDirty;
    updateScreen.isPristine = updateScreen.isPristine && !blocksmithState.isDirty;
  }

  return {
    ...updateScreen,
    blocksmithState,
    formValues: getFormValues(formNames.PERSON)(state),
  };
};
