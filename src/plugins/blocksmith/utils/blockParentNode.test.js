import test from 'tape';
import testDocument from './testDocument';
import blockParentNode from './blockParentNode';

test('Blocksmith:util:blockParentNode', (t) => {
  const actual = testDocument.getBlockParentNode();
  const expected = blockParentNode.get();
  t.equal(actual, expected, 'It should get the block parent node.');

  t.true(blockParentNode.contains(testDocument.getBlockParentChild()), 'It should confirm that the block parent node contains the provided node.');

  t.true(blockParentNode.is(testDocument.getBlockParentNode()), 'It should confirm that the block parent node is provided other node.');

  t.end();
});
