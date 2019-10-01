import test from 'tape';
import testDocument from './testDocument';
import getValidBlockTarget from './getValidBlockTarget';

test('Blocksmith:util:getValidBlockTarget', (t) => {
  let actual = getValidBlockTarget(testDocument.getBlockParentNode());
  let expected = null;
  t.equal(actual, expected, 'It should return null when the provided node is the block parent node.');

  actual = getValidBlockTarget(testDocument.getBlockParentChild());
  expected = testDocument.getBlockParentChild();
  t.equal(actual, expected, 'It should return the provided node when it is a direct child of the block parent node.');

  actual = getValidBlockTarget(testDocument.getBlockParentChildChild());
  expected = testDocument.getBlockParentChild();
  t.equal(actual, expected, 'It should return the node that is a direct child of the block parent node and also an ancestor of the provided node.');

  actual = getValidBlockTarget(testDocument.getNonContainedNode());
  expected = null;
  t.equal(actual, expected, 'It should return null when the provided node is not the parent node or a child of the parent node.');

  t.end();
});
