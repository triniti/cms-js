import getCommand from '@triniti/cms/plugins/pbjx/selectors/getCommand';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import PatchAssetsV1Mixin from '@triniti/schemas/triniti/dam/mixin/patch-assets/PatchAssetsV1Mixin';
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

  const patchAssetsCommandState = getCommand(state, PatchAssetsV1Mixin.findOne().getCurie());
  const { response } = searchNodesRequestState;
  const isReorderGranted = isGranted(state, `${schemas.reorderGalleryAssets.getCurie()}`);

  return {
    nodes: response ? response.get('nodes', []) : [],
    isReorderGranted,
    patchAssetsCommandState,
    searchNodesRequestState,
  };
};
