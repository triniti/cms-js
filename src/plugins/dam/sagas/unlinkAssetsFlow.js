import { call, delay, fork, put, putResolve } from 'redux-saga/effects';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';
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
  yield fork([toast, 'show']);

  try {
    yield putResolve(pbj);
    yield call(successFlow, resolve, config.schemas);
  } catch (e) {
    yield call(failureFlow, reject, e);
  }
}
