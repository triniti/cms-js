import createNodeModalSelector from '@triniti/cms/plugins/ncr/components/create-node-modal/selector';
import { formNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => createNodeModalSelector(state, ownProps, {
  formName: formNames.CREATE_GALLERY,
});
