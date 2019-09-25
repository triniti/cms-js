import test from 'tape';
import testDocument from './testDocument';
import blockParentNodeFn from './blockParentNode';

test('Blocksmith:util:blockParentNode', (t) => {
  const actual = testDocument.getBlockParentNode();
  const expected = blockParentNodeFn.get();
  t.equal(actual, expected, 'It should get the block parent node.');

  t.true(blockParentNodeFn.contains(testDocument.getBlockParentChild()), 'It should confirm that the block parent node contains the provided node.');

  t.true(blockParentNodeFn.is(testDocument.getBlockParentNode()), 'It should confirm that the block parent node is provided other node.');

  t.end();
});
