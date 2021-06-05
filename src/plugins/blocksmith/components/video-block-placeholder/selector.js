import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => {
  let imageRef = node.get('poster_image_ref');
  const video = getNode(state, node.get('node_ref'));

  if (!imageRef && video) {
    imageRef = video.get('poster_image_ref', video.get('image_ref'));
  }

  return {
    image: imageRef ? getNode(state, imageRef) : null,
    imageRef,
    node: video,
    nodeRef: node.get('node_ref'),
  };
};
