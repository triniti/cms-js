import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object}   state            - The entire redux state.
 * @param {{ block }} ownProps  - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const galleryNode = getNode(state, block.get('node_ref'));
  let imageNode = null;
  if (galleryNode && galleryNode.has('image_ref')) {
    imageNode = getNode(state, galleryNode.get('image_ref'));
  }
  if (block.has('poster_image_ref')) {
    imageNode = getNode(state, block.get('poster_image_ref'));
  }
  return {
    galleryNode,
    imageNode,
  };
};
