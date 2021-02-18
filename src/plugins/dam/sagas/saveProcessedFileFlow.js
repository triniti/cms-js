import { put, putResolve } from 'redux-saga/effects';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import completeProcessFile from '../actions/completeProcessFile';
import updatedProcessedFileAsset from '../actions/updateProcessedFileAsset';
import getImageUrlDimensions from '../utils/getImageUrlDimensions';

/**
 * Save Processed File Flow
 *
 * @param {String} hashName
 * @param {Object} fileInfo
 * @param {Object} action
 */
export default function* (hashName, fileInfo, action) {
  const { asset, gallerySequence } = fileInfo;
  const { config, linkedRefs, galleryRef } = action;
  const { schemas } = config;
  const clonedAsset = asset.clone();
  // Attaches assets to specified refs
  if (linkedRefs) {
    clonedAsset.addToSet('linked_refs', linkedRefs);
  }
  if (galleryRef) {
    clonedAsset.set('gallery_ref', galleryRef);
  }
  if (gallerySequence) {
    clonedAsset.set('gallery_seq', gallerySequence);
  }
  // Specific logic for asset types with custom data. In this case, only image assets have
  // specifics to be set. Something fancier can be mocked up when each asset type has
  // different logic.
  if (asset.get('_id').getType() === 'image') {
    const { width, height } = yield getImageUrlDimensions(damUrl(asset, fileInfo.version, 'n'));
    clonedAsset.set('width', width);
    clonedAsset.set('height', height);
    yield put(updatedProcessedFileAsset(hashName, clonedAsset));
  }
  const createAsset = schemas.createNode.createMessage({ node: clonedAsset });
  // @fixme reviewing/testing concurrent createAsset commands
  yield putResolve(createAsset);
  yield put(completeProcessFile(hashName));
}
