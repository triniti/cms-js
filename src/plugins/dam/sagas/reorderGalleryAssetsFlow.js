import { buffers } from 'redux-saga';
import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import swal from 'sweetalert2';

import { reorderGalleryOperations } from '@triniti/cms/plugins/curator/constants';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';

/**
 * @param reorderGalleryOperation
 * @param resolve
 */
export function* successFlow(reorderGalleryOperation, resolve) {
  yield call([toast, 'close']);
  yield call(resolve);
  if (reorderGalleryOperation === reorderGalleryOperations.REMOVE_GALLERY_ASSET) {
    yield put(sendAlert({
      type: 'success',
      isDismissible: true,
      delay: 2000,
      message: 'Asset Removed!',
    }));
  }
}

/**
 * @param failedOperation
 * @param reject
 */
export function* failureFlow(failedOperation, reject) {
  let message;
  switch (failedOperation) {
    case reorderGalleryOperations.ADD_GALLERY_ASSETS:
      message = {
        title: 'Adding Image(s) Failed.',
        text: 'Image was not added.  Please try again.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Continue',
      };
      break;
    case reorderGalleryOperations.REORDER_GALLERY_ASSETS:
      message = {
        title: 'Image Move Failed.',
        text: 'Image was not moved.  Please try again.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Continue',
      };
      break;
    case reorderGalleryOperations.REMOVE_GALLERY_ASSET:
      message = {
        title: 'Image Removal Failed.',
        text: 'Image was not removed.  Please try again.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Continue',
      };
      break;
    default:
      message = {
        title: 'An error occurred.',
        text: 'Update was not saved.  Please try again.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Continue',
      };
  }

  yield call([toast, 'close']);
  yield call(swal, message);
  yield call(reject);
}

/**
 * Link an Asset
 * @param pbj
 * @param resolve
 * @param reject
 * @param obj
 */
export default function* reorderGalleryAssetsFlow({
  pbj,
  resolve,
  reject,
  reorderGalleryOperation,
  config,
}) {
  const expectedEvent = config.schemas.galleryAssetReordered.getCurie().toString();
  const eventChannel = yield actionChannel(expectedEvent, buffers.dropping(10));
  yield fork([toast, 'show']);
  yield putResolve(pbj);
  const result = yield race({
    event: call(waitForMyEvent, eventChannel, config.assetCount),
    timeout: delay(7500),
  });

  try {
    if (result.timeout) {
      yield call(failureFlow, reorderGalleryOperation, reject);
    } else {
      yield delay(1200);
      yield call(successFlow, reorderGalleryOperation, resolve);
    }
  } catch (e) {
    yield call(failureFlow, reorderGalleryOperation, reject);
  }
}
