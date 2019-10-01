import test from 'tape';
import { actionTypes } from '../constants';
import batchMarkNodesAsDraft from './batchMarkNodesAsDraft';

test('batchMarkNodesAsDraft action creator tests', (t) => {
  const nodeRefs = [];
  const config = {};
  const actual = batchMarkNodesAsDraft(nodeRefs, config);

  const expected = {
    type: actionTypes.BATCH_MARK_NODES_AS_DRAFT_REQUESTED,
    nodeRefs,
    config,
  };

  t.same(actual, expected, 'it should create a BATCH_MARK_NODES_AS_DRAFT_REQUESTED action.');
  t.end();
});
