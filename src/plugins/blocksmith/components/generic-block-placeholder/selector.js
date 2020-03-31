import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state                     - The entire redux state.
 * @param {{ block, blockProps, contentState }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { block, blockProps }) => {
  const blockData = block.getData();
  const node = blockData ? blockData.get('canvasBlock', null) : null;

  return {
    targetNode: (node && node.has('node_ref')) ? getNode(state, node.get('node_ref')) : null,
    draggable: !blockProps.getReadOnly(),
  };
};
