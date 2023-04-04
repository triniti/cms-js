import { callPbjx } from '@gdbots/pbjx/redux/actions';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import reorderGalleryAssets from '@triniti/cms/plugins/dam/actions/reorderGalleryAssets';
import schemas from './schemas';
import { pbjxChannelNames, reorderGalleryOperations } from '../../constants';

export default (dispatch, { nodeRef }) => ({
  handleClearChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.GALLERY_MEDIA_SEARCH));
  },

  handleAddGalleryAssets: (assetMap) => new Promise((resolve, reject) => {
    const command = schemas.reorderGalleryAssets.createMessage({
      gallery_ref: nodeRef.toString(),
      gallery_seqs: assetMap,
    });

    const config = {
      schemas,
      assetCount: Object.keys(assetMap).length,
    };

    dispatch(reorderGalleryAssets(
      command,
      resolve,
      reject,
      reorderGalleryOperations.ADD_GALLERY_ASSETS,
      config,
    ));
  }),

  handleReorderGalleryAssets: (assetsToUpdate) => new Promise((resolve, reject) => {
    const config = { schemas, assetCount: Object.keys(assetsToUpdate).length };
    const command = schemas.reorderGalleryAssets.createMessage({
      gallery_seqs: assetsToUpdate,
      gallery_ref: nodeRef.toString(),
    });

    dispatch(reorderGalleryAssets(
      command,
      resolve,
      reject,
      reorderGalleryOperations.REORDER_GALLERY_ASSETS,
      config,
    ));
  }),

  handleRemoveGalleryAsset: (asset) => new Promise((resolve, reject) => {
    const config = { schemas };
    const assetId = asset.get('_id').toString();
    const assetToUpdate = { [assetId]: 0 };
    const oldGalleryRefs = { [assetId]: nodeRef.toString() };

    const command = schemas.reorderGalleryAssets.createMessage({
      gallery_seqs: assetToUpdate,
      old_gallery_refs: oldGalleryRefs,
    });

    dispatch(reorderGalleryAssets(
      command,
      resolve,
      reject,
      reorderGalleryOperations.REMOVE_GALLERY_ASSET,
      config,
    ));
  }),

  handleSearchGalleryAssets: (newRequest = {}) => {
    const message = schemas.searchNodesRequest.createMessage()
      .set('gallery_ref', nodeRef)
      .set('status', NodeStatus.PUBLISHED)
      .addToSet('types', ['image-asset'])
      .set('sort', SearchAssetsSort.GALLERY_SEQ_DESC)
      .set('count', 255)
      .set('page', newRequest.page || 1);

    dispatch(callPbjx(message, pbjxChannelNames.GALLERY_MEDIA_SEARCH));
  },
});