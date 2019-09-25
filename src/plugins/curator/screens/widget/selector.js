import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import schemas from './schemas';
import { formNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, ownProps) => updateScreenSelector(state, ownProps, {
  schemas,
  formName: formNames.WIDGET,
});
