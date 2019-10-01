import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => {
  let imageRef = node.get('poster_image_ref');
  const gallery = getNode(state, node.get('node_ref'));

  if (!imageRef && gallery) {
    imageRef = gallery.get('image_ref');
  }

  return {
    image: imageRef ? getNode(state, imageRef) : null,
    imageRef,
  };
};
