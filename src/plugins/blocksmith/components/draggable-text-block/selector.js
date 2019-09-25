/**
 * This state-independent selector is a rather miserable solution to the problem that
 * blockRendererFn does not get called when changing view/edit mode, but we still need to render
 * the block to add/remove the drag handles and re-rendering the whole editor is not trivial.
 *
 * @link https://github.com/facebook/draft-js/issues/458
 *
 * @param {Object} state            - The entire redux state.
 * @param {{ blockProps }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { blockProps }) => ({
  draggable: !blockProps.getReadOnly(),
  handleFocus: blockProps.handleFocus,
});
