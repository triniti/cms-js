import test from 'tape';
import isEqual from 'lodash/isEqual';
import ImageAssetV1 from '@triniti/acme-schemas/acme/dam/node/ImageAssetV1';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';

import moveNodeByGallerySequence from './moveNodeByGallerySequence';


const nonExistentNode = ImageAssetV1
  .create()
  .set('_id', AssetId.fromString('image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6520'))
  .set('mime_type', 'image/jpeg');

const nodesToReorder = [];
const gallerySeqs = [12000, 11000, 10100, 1092, 1080, 1070, 1005, 1002, 1000, 888];

for (let i = 0; i < 10; i += 1) {
  nodesToReorder.push(ImageAssetV1
    .create()
    .set('title', `asset${i}`)
    .set('_id', AssetId.fromString(`image_jpg_20151201_cb9c3c8c5c88453b960933a59ede650${i}`))
    .set('gallery_seq', gallerySeqs[i])
    .set('mime_type', 'image/jpeg'));
}

test('moveNodeByGallerySequence: node not found in nodesToReorder', (t) => {
  const nodeToMove = nonExistentNode;
  const gallerySeq = 1080;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);
  let actual = reorderedNodes.sort();
  let expected = nodesToReorder.sort();

  t.true(isEqual(actual, expected), 'it should return same copy of nodesToReorder');

  reorderedNodes[0] = null;
  actual = reorderedNodes.sort();
  expected = nodesToReorder.sort();
  t.false(isEqual(actual, expected), 'it should return a new copy of the nodesToReorder');

  t.end();
});


test('moveNodeByGallerySequence: reorder an empty nodesToReorder', (t) => {
  const nodeToMove = nodesToReorder[2];
  const gallerySeq = 1080;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, []);
  let actual = reorderedNodes.sort();
  let expected = [].sort();

  t.true(isEqual(actual, expected), 'it should return same empty collection');

  reorderedNodes[0] = null;
  actual = reorderedNodes.sort();
  expected = nodesToReorder.sort();
  t.false(isEqual(actual, expected), 'it should return a new copy of the nodesToReorder');

  t.end();
});

test('moveNodeByGallerySequence: move node item using negative gallery seq', (t) => {
  const nodeToMoveIndex = 2;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = -1075;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);

  const actual = reorderedNodes[9].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'node should be moved to the last index');

  t.end();
});

test('moveNodeByGallerySequence: move node item using invalid gallery seq', (t) => {
  const nodeToMoveIndex = 3;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = '***********??????';
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);

  const actual = reorderedNodes[9].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'node should be moved to the last index');

  t.end();
});

test('moveNodeByGallerySequence: move first node item to index 4', (t) => {
  const nodeToMoveIndex = 0;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = 1075;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);

  const actual = reorderedNodes[4].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'first node should be moved to index 4');

  t.end();
});

test('moveNodeByGallerySequence: move last node item to index 2', (t) => {
  const nodeToMoveIndex = 9;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = 10500;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);
  const actual = reorderedNodes[2].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'last node should be moved to index 2');

  t.end();
});

test('moveNodeByGallerySequence: move node item using greater than max. range gallery seq', (t) => {
  const nodeToMoveIndex = 9;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = 13000;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);
  const actual = reorderedNodes[0].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'last node should be moved to 0 index');

  t.end();
});

test('moveNodeByGallerySequence: move node item using lesser than min. range gallery seq', (t) => {
  const nodeToMoveIndex = 0;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = 100;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);
  const actual = reorderedNodes[9].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'first node should be moved to the last index');

  t.end();
});

test('moveNodeByGallerySequence: move eight node item to index 1', (t) => {
  const nodeToMoveIndex = 7;
  const nodeToMove = nodesToReorder[nodeToMoveIndex];
  const gallerySeq = 11500;
  const reorderedNodes = moveNodeByGallerySequence(gallerySeq, nodeToMove, nodesToReorder);
  const actual = reorderedNodes[1].get('_id');
  const expected = nodesToReorder[nodeToMoveIndex].get('_id');

  t.equal(actual, expected, 'eight node should be moved to index 1');

  t.end();
});
