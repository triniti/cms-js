import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => {
  const imageRef = node.get('image_ref') || getNode(state, node.get('node_ref')).get('image_ref');
  return {
    image: imageRef ? getNode(state, imageRef) : null,
    imageRef,
  };
};
