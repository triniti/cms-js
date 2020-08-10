import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ node }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { video }) => ({
  mezzanine: video && video.has('mezzanine_ref') ? getNode(state, video.get('mezzanine_ref')) : null,
});
