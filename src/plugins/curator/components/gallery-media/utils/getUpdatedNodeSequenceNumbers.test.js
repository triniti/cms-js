import test from 'tape';
import ImageAssetV1 from '@triniti/acme-schemas/acme/dam/node/ImageAssetV1';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';

import getUpdatedNodeSequenceNumbers from './getUpdatedNodeSequenceNumbers';
import moveNodeByIndex from './moveNodeByIndex';

const gallerySeqs = [12600, 12500, 12598, 10100, 1097, 1080, 1079, 1078, 981, 980].sort((a, b) => (a > b ? -1 : 1));
const mockedNodes = [];
const getMockedNodeId = (index) => `image_jpg_20151201_cb9c3c8c5c88453b960933a59ede650${index}`;

for (let i = 0; i < 10; i += 1) {
  mockedNodes.push(ImageAssetV1
    .create()
    .set('title', `asset${i}`)
    .set('_id', AssetId.fromString(getMockedNodeId(i)))
    .set('gallery_seq', gallerySeqs[i])
    .set('mime_type', 'image/jpeg'));
}

const getReorderedNodes = (oldIndex, newIndex, nodes) => {
  const newNodes = nodes.length ? [...nodes] : mockedNodes.map((node) => node.clone());
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(oldIndex, newIndex, newNodes);

  const reorderedNodes = moveNodeByIndex(oldIndex, newIndex, newNodes);

  Object.keys(updatedNodeSequenceNumbers)
  // eslint-disable-next-line no-loop-func
    .forEach((nodeId) => reorderedNodes.find((node) => node.get('_id').toString() === nodeId)
      .set('gallery_seq', updatedNodeSequenceNumbers[nodeId]));

  return reorderedNodes;
};

const testEachReorderedNodes = (t, oldIndex, newIndex, nodes) => {
  const updatedGallerySeqs = nodes.map((node) => node.get('gallery_seq'));

  let isValid = false;
  let actual = isValid;
  const expected = true;
  for (let y = updatedGallerySeqs.length - 1; y >= 0; y -= 1) {
    const currentSequence = updatedGallerySeqs[y];
    const nextSequence = updatedGallerySeqs[y - 1];
    if (!nextSequence) {
      break;
    }
    isValid = currentSequence < nextSequence;
    if (!isValid) {
      break;
    }
  }
  actual = isValid;
  t.equal(actual, expected, `sequence should be in incrementing order and no duplicates: oldIndex: ${oldIndex} newIndex: ${newIndex}`);

  isValid = false;
  for (let y = 0; y < nodes.length; y += 1) {
    const currentSequence = updatedGallerySeqs[y];
    const nextSequence = updatedGallerySeqs[y + 1];
    if (!nextSequence) {
      break;
    }
    isValid = currentSequence > nextSequence;
    if (!isValid) {
      break;
    }
  }
  t.equal(actual, expected, `sequence should be in decrementing order and no duplicates: oldIndex: ${oldIndex} newIndex: ${newIndex}`);
};

test('getUpdatedNodeSequenceNumbers: move nodes on different indexes and test for duplicates', (t) => {
  let reorderedNodes = [];

  for (let i = 0; i < mockedNodes.length; i += 1) {
    const oldIndex = i;

    for (let z = mockedNodes.length - 1; z >= 0; z -= 1) {
      const newIndex = z;
      if (oldIndex === newIndex) {
        continue;
      }
      reorderedNodes = getReorderedNodes(oldIndex, newIndex, reorderedNodes);
      testEachReorderedNodes(t, oldIndex, newIndex, reorderedNodes);
    }

    for (let x = 0; x < mockedNodes.length; x += 1) {
      const newIndex = x;
      if (oldIndex === newIndex) {
        continue;
      }
      reorderedNodes = getReorderedNodes(oldIndex, newIndex, reorderedNodes);
      testEachReorderedNodes(t, oldIndex, newIndex, reorderedNodes);
    }
  }
  t.end();
});
