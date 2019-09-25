import test from 'tape';
import { delay, put } from 'redux-saga/effects';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import { actionTypes } from '../constants';
import searchNodesFlow from './searchNodesFlow';

test('Ncr:search nodes test[default channel]', (t) => {
  const testAction = { type: actionTypes.SEARCH_NODES_REQUESTED, pbj: 'this is a pbj message' };
  const generator = searchNodesFlow(testAction);

  const expectCall = delay(500);
  t.deepEqual(generator.next().value, expectCall, 'it calls delay for 500ms');

  const expectDispatchAction = put(callPbjx(testAction.pbj, 'root'));
  t.deepEqual(generator.next().value, expectDispatchAction, 'it should search under the default "root" channel');

  t.end();
});


test('search user tests', (t) => {
  const testAction = { type: actionTypes.SEARCH_NODES_REQUESTED, pbj: 'this is a pbj message', channel: 'test' };
  const generator = searchNodesFlow(testAction);

  const expectCall = delay(500);
  t.deepEqual(generator.next().value, expectCall, 'it calls delay for 500ms');

  const expectDispatchAction = put(callPbjx(testAction.pbj, testAction.channel));
  t.deepEqual(generator.next().value, expectDispatchAction, 'it should search under a given pbjx channel');

  t.end();
});
