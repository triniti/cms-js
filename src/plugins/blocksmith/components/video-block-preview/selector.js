import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object}   state    - The entire redux state.
 * @param {{ block }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const videoNode = getNode(state, block.get('node_ref'));
  const imageRef = block.has('poster_image_ref')
    ? block.get('poster_image_ref')
    : videoNode.get('poster_image_ref', videoNode.get('image_ref'));

  return {
    getNode: (ref) => getNode(state, ref),
    imageRef,
    videoNode,
  };
};
