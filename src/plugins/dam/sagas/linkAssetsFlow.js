import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import swal from 'sweetalert2';

import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';

import linkAssetsTimedoutFlow from './linkAssetsTimedoutFlow';
import { pbjxChannelNames as pbjxChannelNamesImage } from '../components/image-search/constants';

/**
 * @param resolve
 * @param imageCount
 */
export function* successFlow(resolve, { schemas, numAssets }) {
  let message = 'Images were linked';
  if (numAssets) {
    if (numAssets === 1) {
      message = '1 image was linked';
    } else {
      message = `${numAssets} images were linked`;
    }
  }

  yield put(clearResponse(
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNamesImage.IMAGE_SEARCH,
  ));

  yield put(clearResponse(
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNamesImage.MEDIA_SEARCH,
  ));

  yield call(resolve);
  yield call([toast, 'close']);
  yield swal.fire({
    title: 'Success!',
    text: message,
    type: 'success',
    showCancelButton: false,
    confirmButtonText: 'Continue',
  });
}

/**
 * @param reject
 * @param error
 * @param failedCount
 * @param expectedCount
 */
export function* failureFlow(reject, error = null, failedCount, expectedCount) {
  let text = 'Images were not linked. ';

  if (failedCount) {
    text = `${failedCount} of ${expectedCount} image${failedCount === 1 ? ' was' : 's were'} not linked. `;
  }

  if (error) {
    text += ` Error: ${error.getMessage ? error.getMessage() : error.message}. `;
  }

  text += 'Please try again.';

  yield call(reject);
  yield call([toast, 'close']);
  yield swal.fire({
    title: 'Link Failed.',
    text,
    type: 'warning',
    showCancelButton: false,
    confirmButtonText: 'Continue',
  });
}

/**
 * Link Assets
 * @param pbj
 * @param resolve
 * @param reject
 * @param config
 */
export default function* linkAssetsFlow({ pbj, resolve, reject, config }) {
  yield fork([toast, 'show']);
  yield putResolve(pbj);
  const expectedEvent = config.schemas.assetLinked.getCurie().toString();
  const eventChannel = yield actionChannel(expectedEvent);
  const result = yield race({
    event: call(waitForMyEvent, eventChannel),
    timeout: delay(5000),
  });

  if (result.timeout) {
    try {
      const manualCheck = yield call(linkAssetsTimedoutFlow, pbj, config.schemas);

      if (!manualCheck.ok) {
        yield call(
          failureFlow,
          reject,
          new OperationTimedOut(pbj),
          manualCheck.failedImages,
          config.numAssets,
        );

        return;
      }
    } catch (e) {
      yield call(failureFlow, reject, e);
      return;
    }
  }

  yield call(successFlow, resolve, config);
}
