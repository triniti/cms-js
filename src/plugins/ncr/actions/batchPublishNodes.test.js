import test from 'tape';
import { actionTypes } from '../constants';
import batchPublishNodes from './batchPublishNodes';

test('batchMarkNodesAsDraft action creator tests', (t) => {
  const nodeRefs = [];
  const config = {};
  const actual = batchPublishNodes(nodeRefs, config);

  const expected = {
    type: actionTypes.BATCH_PUBLISH_NODES_REQUESTED,
    nodeRefs,
    config,
  };

  t.same(actual, expected, 'it should create a BATCH_PUBLISH_NODES_REQUESTED action.');
  t.end();
});
