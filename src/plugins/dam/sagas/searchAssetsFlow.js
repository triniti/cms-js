import { delay, putResolve } from 'redux-saga/effects';

export default function* searchAssetsFlow({ pbj }) {
  yield delay(500);
  yield putResolve(pbj);
}
