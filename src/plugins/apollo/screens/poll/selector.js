import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import { formNames } from '../../constants';
import schemas from './schemas';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => updateScreenSelector(state, ownProps, {
  schemas,
  formName: formNames.POLL,
});
