import test from 'tape';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';

import getUpdatedNodeSequenceNumbers from './getUpdatedNodeSequenceNumbers';

const assetSchemas = AssetV1Mixin.findAll();
const imageAssetSchema = assetSchemas[4];
const gallerySeqs = [12000, 11000, 10100, 1090, 1080, 1079, 1005, 1005, 1000, 888];
const mockedNodes = [];
const getMockedNodeId = (index) => `image_jpg_20151201_cb9c3c8c5c88453b960933a59ede650${index}`;

for (let i = 0; i < 10; i += 1) {
  mockedNodes.push(imageAssetSchema
    .createMessage()
    .set('title', `asset${i}`)
    .set('_id', AssetId.fromString(getMockedNodeId(i)))
    .set('gallery_seq', gallerySeqs[i])
    .set('mime_type', 'image/jpeg'));
}

// ff. tests are intended for auto-corrections of duplicate and invalid sequences

test('getUpdatedNodeSequenceNumbers: move item from second to fifth index and test for corrected sequence', (t) => {
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(2, 4, mockedNodes);
  let actual = updatedNodeSequenceNumbers[getMockedNodeId(4)];
  let expected = mockedNodes[4].get('gallery_seq') + 10;
  t.equal(actual, expected, 'it should auto-correct the sequence on fourth index');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(2)];
  const highSequence = updatedNodeSequenceNumbers[getMockedNodeId(4)];
  const lowSequence = mockedNodes[5].get('gallery_seq');
  expected = Math.ceil((highSequence + lowSequence) / 2);
  t.equal(actual, expected, 'it should be equal to the sum of corrected high and low sequence divided by 2');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(3)];
  expected = mockedNodes[3].get('gallery_seq') + 10;
  t.equal(actual, expected, 'it should auto-correct item on third index');

  t.end();
});

test('getUpdatedNodeSequenceNumbers: move item from last index to fifth index and test for auto-corrected sequence', (t) => {
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(9, 5, mockedNodes);
  let actual = updatedNodeSequenceNumbers[getMockedNodeId(5)];
  let expected = mockedNodes[5].get('gallery_seq') - 10;
  t.equal(actual, expected, 'it should auto-correct the sequence on fifth index');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(9)];
  const lowSequence = updatedNodeSequenceNumbers[getMockedNodeId(5)];
  const highSequence = mockedNodes[4].get('gallery_seq');
  expected = Math.ceil((highSequence + lowSequence) / 2);
  t.equal(actual, expected, 'it should be equal to the sum of corrected low and high sequence divided by 2');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(6)];
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct item on sixth index');

  t.end();
});

test('getUpdatedNodeSequenceNumbers: move item from seventh index to second index', (t) => {
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(7, 2, mockedNodes);
  let actual = updatedNodeSequenceNumbers[getMockedNodeId(7)];
  let expected = Math.ceil((mockedNodes[1].get('gallery_seq') + mockedNodes[2].get('gallery_seq')) / 2);
  t.equal(actual, expected, 'it should have a sequence value between index 1 and 2');

  actual = Object.keys(updatedNodeSequenceNumbers).length;
  expected = 1;
  t.equal(actual, expected, 'it should only have the sequence value of the moved item');

  t.end();
});


test('getUpdatedNodeSequenceNumbers: move item from first index to sixth index', (t) => {
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(0, 6, mockedNodes);
  let actual = updatedNodeSequenceNumbers[getMockedNodeId(7)];
  let expected = mockedNodes[7].get('gallery_seq') - 10;
  t.equal(actual, expected, 'it should auto-correct low sequence of seventh index item');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(6)];
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct high sequence of sixth index item');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(0)];
  const highSequence = mockedNodes[6].get('gallery_seq');
  const lowSequence = updatedNodeSequenceNumbers[getMockedNodeId(7)];
  expected = Math.ceil((highSequence + lowSequence) / 2);
  t.equal(actual, expected, 'it should be equal to the sum of corrected low and high sequence divided by 2');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(8)];
  expected = updatedNodeSequenceNumbers[getMockedNodeId(7)] - 10;
  t.equal(actual, expected, 'it should auto-correct sequence on eight index since it should be lower');

  actual = updatedNodeSequenceNumbers[getMockedNodeId(9)];
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct sequence on last index');

  t.end();
});

test('getUpdatedNodeSequenceNumbers: swap duplicate items from higher old index to lower new index', (t) => {
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(7, 6, mockedNodes);

  const correctedSequenceForOldIndex = updatedNodeSequenceNumbers[getMockedNodeId(7)];
  const correctedSequenceForNewIndex = updatedNodeSequenceNumbers[getMockedNodeId(6)];
  const correctedSequenceForEightIndex = updatedNodeSequenceNumbers[getMockedNodeId(8)];

  let actual = correctedSequenceForOldIndex < correctedSequenceForNewIndex;
  let expected = true;
  t.equal(actual, expected, 'it should auto-correct sequence');

  actual = correctedSequenceForOldIndex > correctedSequenceForEightIndex;
  expected = true;
  t.equal(actual, expected, 'it should auto-correct the eight index and lower than seventh');
  t.end();
});


test('getUpdatedNodeSequenceNumbers: swap duplicate items from lower old index to higher new index', (t) => {
  const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(6, 7, mockedNodes);

  const correctedSequenceForOldIndex = updatedNodeSequenceNumbers[getMockedNodeId(6)];
  const correctedSequenceForNewIndex = updatedNodeSequenceNumbers[getMockedNodeId(7)];
  const correctedSequenceForEightIndex = updatedNodeSequenceNumbers[getMockedNodeId(8)];

  let actual = correctedSequenceForOldIndex > correctedSequenceForEightIndex;
  let expected = true;
  t.equal(actual, expected, 'it should auto-correct sequence');

  actual = correctedSequenceForNewIndex;
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct the new index');
  t.end();
});
