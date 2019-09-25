import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state                     - The entire redux state.
 * @param {{ block, blockProps, contentState }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { block, blockProps, contentState }) => {
  const entityKey = block.getEntityAt(0);
  const node = contentState.getEntity(entityKey).getData().block;

  return {
    targetNode: node.has('node_ref') ? getNode(state, node.get('node_ref')) : null,
    draggable: !blockProps.getReadOnly(),
  };
};
