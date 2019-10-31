import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';


/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const searchNodesRequestState = getRequest(
    state,
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNames.GALLERY_MEDIA_SEARCH,
  );

  const { response } = searchNodesRequestState;
  const items = response ? response.get('nodes', []).map((asset) => ({
    asset,
    assetId: asset.get('_id'),
    gallerySequence: asset.get('gallery_seq'),
  })) : [];

  const isReorderGranted = isGranted(state, `${schemas.reorderGalleryAssets.getCurie()}`);

  return {
    getNode: (nodeRef) => getNode(state, nodeRef),
    items,
    isReorderGranted,
    searchNodesRequestState,
  };
};
