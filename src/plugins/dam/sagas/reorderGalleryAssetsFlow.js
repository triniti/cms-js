import { call, delay, fork, put, putResolve } from 'redux-saga/effects';
import swal from 'sweetalert2';
import { reorderGalleryOperations } from '@triniti/cms/plugins/curator/constants';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';

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
  yield swal.fire(message);
  yield call(reject);
}

/**
 * Link an Asset
 * @param pbj
 * @param resolve
 * @param reject
 * @param obj
 */
export default function* reorderGalleryAssetsFlow({ pbj, resolve, reject, reorderGalleryOperation }) {
  try {
    yield fork([toast, 'show']);
    yield putResolve(pbj);
    // delaying for 1 second ensure that gallery is updated when calling search gallery assets
    yield delay(1000);
    yield call(successFlow, reorderGalleryOperation, resolve);
  } catch (e) {
    yield call(failureFlow, reorderGalleryOperation, reject);
  }
}
