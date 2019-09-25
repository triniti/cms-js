import { delay, put } from 'redux-saga/effects';
import { callPbjx } from '@gdbots/pbjx/redux/actions';

export default function* searchNodesFlow({ pbj, channel }) {
  yield delay(500);
  yield put(callPbjx(pbj, channel));
}
