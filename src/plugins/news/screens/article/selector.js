import getBlocksmith from '@triniti/cms/plugins/blocksmith/selectors/getBlocksmith';
import { getFormValues } from 'redux-form';
import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import schemas from './schemas';
import { formNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => {
  const updateScreen = updateScreenSelector(state, ownProps, {
    schemas,
    formName: formNames.ARTICLE,
  });

  const blocksmithState = getBlocksmith(state, formNames.ARTICLE);
  if (blocksmithState) {
    updateScreen.isSaveDisabled = updateScreen.isSaveDisabled && !blocksmithState.isDirty;
    updateScreen.isPristine = updateScreen.isPristine && !blocksmithState.isDirty;
  }

  return {
    ...updateScreen,
    blocksmithState,
    formValues: getFormValues(formNames.ARTICLE)(state),
  };
};
