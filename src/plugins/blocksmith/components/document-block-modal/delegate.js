import throttle from 'lodash/throttle';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import clearChannel from '../../../pbjx/actions/clearChannel';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

export default (dispatch) => ({
  handleClearDocumentAssetChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.DOCUMENT_ASSET_SEARCH));
  },

  /**
   * @param {Object} data - pbj search request data
   */
  handleSearchDocumentAssets: throttle((data = {}) => {
    dispatch(searchNodes(schemas.searchAssets.createMessage({
      count: 50,
      page: 1,
      types: ['document-asset'],
      ...data,
    }), pbjxChannelNames.DOCUMENT_ASSET_SEARCH));
  }, 500),
});
