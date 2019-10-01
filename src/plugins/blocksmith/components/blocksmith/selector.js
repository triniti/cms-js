import getCopiedBlock from '../../selectors/getCopiedBlock';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => ({
  copiedBlock: getCopiedBlock(state),
});
