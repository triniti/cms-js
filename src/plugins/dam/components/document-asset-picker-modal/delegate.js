import throttle from 'lodash/throttle';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import { pbjxChannelNames } from '@triniti/cms/plugins/dam/constants';
import clearChannel from '../../../pbjx/actions/clearChannel';
import schemas from './schemas';

// todo: do we need clearChannel here?
export default (dispatch, { searchDocumentsQ }) => ({
  handleClearDocumentAssetChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.DOCUMENT_ASSET_SEARCH));
  },

  /**
   * @param {Object} data - pbj search request data
   */
  handleSearchDocumentAssets: throttle((data = {}) => {
    dispatch(searchNodes(schemas.searchAssets.createMessage({
      count: 25,
      page: 1,
      types: ['document-asset'],
      ...data,
      q: `${searchDocumentsQ || ''} ${data.q}`,
    }), pbjxChannelNames.DOCUMENT_ASSET_SEARCH));
  }, 500),
});
