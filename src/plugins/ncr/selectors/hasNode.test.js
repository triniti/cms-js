import test from 'tape';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import hasNode from './hasNode';

test('hasNode tests', (t) => {
  const nodeRef = NodeRef.fromString('acme:article:123');
  const state = {
    ncr: {
      nodes: {},
    },
  };

  let actual = hasNode(state, nodeRef);
  let expected = false;
  t.false(actual, expected, 'should return false when node is not in state.');

  state.ncr.nodes.article = { 123: 'a node' };

  actual = hasNode(state, nodeRef);
  expected = false;
  t.true(actual, expected, 'should return true when node is in state.');

  t.end();
});
