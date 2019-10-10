import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { pbjxChannelNames } from '../../constants';
import schemas from './schemas';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const { response, request, status } = getRequest(
    state,
    schemas.searchAssets.getCurie(),
    pbjxChannelNames.DOCUMENT_ASSET_SEARCH,
  );
  const documentAssetSort = (request && request.get('sort').getValue()) || SearchAssetsSort.CREATED_AT_DESC.getValue();
  const documentAssetNodes = (response && response.get('nodes')) || [];
  const isDocumentAssetSearchFulfilled = status === STATUS_FULFILLED;
  const getCurrentPage = (request && request.get('page')) || 1;
  const getRequestVal = request;

  return {
    documentAssetNodes,
    documentAssetSort,
    documentNode: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
    getCurrentPage,
    getRequestVal,
    imageNode: block.has('image_ref') ? getNode(state, block.get('image_ref')) : null,
    isDocumentAssetSearchFulfilled,
  };
};
