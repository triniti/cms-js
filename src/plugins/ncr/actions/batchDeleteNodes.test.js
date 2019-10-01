import test from 'tape';
import { actionTypes } from '../constants';
import batchDeleteNodes from './batchDeleteNodes';

test('batchDeleteNodes action creator tests', (t) => {
  const nodeRefs = [];
  const config = {};
  const actual = batchDeleteNodes(nodeRefs, config);

  const expected = {
    type: actionTypes.BATCH_DELETE_NODES_REQUESTED,
    nodeRefs,
    config,
  };

  t.same(actual, expected, 'it should create a BATCH_DELETE_NODES_REQUESTED action.');
  t.end();
});
