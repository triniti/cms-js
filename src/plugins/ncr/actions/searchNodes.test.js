import test from 'tape';
import { actionTypes } from '../constants';
import searchNodes from './searchNodes';

test('searchNodes action creator tests', (t) => {
  let request = {};
  let actual = searchNodes(request);
  let expected = {
    type: actionTypes.SEARCH_NODES_REQUESTED,
    pbj: request,
    channel: 'root',
  };

  t.same(actual, expected, 'it should create a SEARCH_NODES_REQUESTED action with default channel.');

  request = {};
  actual = searchNodes(request, 'new-channel');
  expected = {
    type: actionTypes.SEARCH_NODES_REQUESTED,
    pbj: request,
    channel: 'new-channel',
  };

  t.same(actual, expected, 'it should create a SEARCH_NODES_REQUESTED action with a given channel.');

  t.end();
});
