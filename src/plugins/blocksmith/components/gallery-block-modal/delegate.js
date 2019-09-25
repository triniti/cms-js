import throttle from 'lodash/throttle';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

export default (dispatch) => ({
  handleClearGalleryChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.GALLERY_SEARCH));
  },

  /**
   * @param {Object} data - pbj search request data except 'page'
   */
  handleSearchGalleries: throttle((data = {}) => {
    dispatch(searchNodes(schemas.searchGalleries.createMessage({
      count: 25,
      page: 1,
      sort: schemas.searchGalleriesSort.ORDER_DATE_DESC.getValue(),
      ...data,
    }), pbjxChannelNames.GALLERY_SEARCH));
  }, 500),
});
