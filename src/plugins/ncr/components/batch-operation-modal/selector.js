import getBatchOperationState from '../../selectors/getBatchOperationState';
/**
 * @param {Object} state     - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => ({
  batchOperation: getBatchOperationState(state),
});
