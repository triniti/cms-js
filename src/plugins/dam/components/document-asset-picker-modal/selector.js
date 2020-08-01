import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { pbjxChannelNames } from '@triniti/cms/plugins/dam/constants';
import schemas from './schemas';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ node }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { documentRef, node }) => {
  const { response, request, status } = getRequest(
    state,
    schemas.searchAssets.getCurie(),
    pbjxChannelNames.DOCUMENT_ASSET_SEARCH,
  );
  const documentAssetSort = (request && request.get('sort').getValue()) || SearchAssetsSort.CREATED_AT_DESC.getValue();
  const documentAssetNodes = (response && response.get('nodes')) || [];
  const isDocumentAssetSearchFulfilled = status === STATUS_FULFILLED;
  return {
    documentAssetNodes,
    documentAssetSort,
    initiallySelected: documentRef ? getNode(state, documentRef) : null,
    isDocumentAssetSearchFulfilled,
    request,
  };
};
