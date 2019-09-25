import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const { response, status } = getRequest(
    state, schemas.searchGalleries.getCurie(), pbjxChannelNames.GALLERY_SEARCH,
  );
  const isGallerySearchRequestFulfilled = status === STATUS_FULFILLED;
  const galleries = (response && response.get('nodes')) || [];

  return {
    galleries,
    gallery: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
    image: block.has('poster_image_ref') ? getNode(state, block.get('poster_image_ref')) : null,
    isGallerySearchRequestFulfilled,
  };
};
