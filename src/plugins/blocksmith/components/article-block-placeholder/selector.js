import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => {
  let imageRef = node.get('image_ref');
  const article = getNode(state, node.get('node_ref'));

  if (!imageRef && article) {
    imageRef = article.get('image_ref');
  }

  return {
    image: imageRef ? getNode(state, imageRef) : null,
    imageRef,
    node: article,
    nodeRef: node.get('node_ref'),
  };
};
