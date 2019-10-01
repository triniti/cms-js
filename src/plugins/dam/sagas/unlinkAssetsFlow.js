import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';

import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';

import unlinkAssetsTimedoutFlow from './unlinkAssetsTimedoutFlow';
import { pbjxChannelNames as pbjxChannelNamesImage } from '../components/image-search/constants';

/**
 * @param resolve
 * @param schemas
 */
export function* successFlow(resolve, schemas) {
  yield put(clearResponse(
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNamesImage.MEDIA_SEARCH,
  ));

  yield delay(500);
  yield call(resolve);
  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'success',
    isDismissible: true,
    delay: 2000,
    message: 'Asset Unlinked!',
  }));
}

/**
 * @param reject
 * @param error
 */
export function* failureFlow(reject, error) {
  let message = 'Unlink failed. ';
  if (error) {
    message += ` Error: ${error.getMessage ? error.getMessage() : error.message}. `;
  }

  yield call(reject, error);
  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'danger',
    isDismissible: true,
    message,
  }));
}

/**
 * @param pbj
 * @param resolve
 * @param reject
 * @param config
 */
export default function* unlinkAssetsFlow({ pbj, resolve, reject, config }) {
  const expectedEvent = config.schemas.assetUnlinked.getCurie().toString();
  const eventChannel = yield actionChannel(expectedEvent);

  yield putResolve(pbj);
  yield fork([toast, 'show']);

  const result = yield race({
    event: call(waitForMyEvent, eventChannel),
    timeout: delay(5000),
  });

  if (result.timeout) {
    try {
      const manualCheck = yield call(unlinkAssetsTimedoutFlow, pbj, config.schemas);
      if (!manualCheck.ok) {
        yield call(failureFlow, reject, new OperationTimedOut(pbj));
        return;
      }
    } catch (e) {
      yield call(failureFlow, reject, e);
      return;
    }
  }

  yield call(successFlow, resolve, config.schemas);
}
