/**
 * @param {Object} state        - the entire redux state
 * @param {{ block }} ownProps  - props given to the component
 *
 * @returns {Object}
 */
export default (state, { block }) => ({
  pollRefs: block ? block.get('node_refs') : null,
});
