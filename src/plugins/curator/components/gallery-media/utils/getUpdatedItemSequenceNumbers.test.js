import test from 'tape';

import getUpdatedItemSequenceNumbers from './getUpdatedItemSequenceNumbers';

const gallerySeqs = [12000, 11000, 10100, 1090, 1080, 1079, 1005, 1005, 1000, 888];
const mockedItems = [];

for (let i = 0; i < 10; i += 1) {
  mockedItems.push({
    assetId: `id-${i}`,
    gallerySequence: gallerySeqs[i],
  });
}

// following tests are for auto-corrections of duplicate and invalid sequences

test('getUpdatedItemSequenceNumbers: move item from second to fifth index and test for corrected sequence', (t) => {
  const items = getUpdatedItemSequenceNumbers(2, 4, mockedItems);
  let actual = items['id-4'];
  let expected = mockedItems[4].gallerySequence + 10;
  t.equal(actual, expected, 'it should autocorrect the sequence on fourth index');

  actual = items['id-2'];
  const highSequence = items['id-4'];
  const lowSequence = mockedItems[5].gallerySequence;
  expected = Math.ceil((highSequence + lowSequence) / 2);
  t.equal(actual, expected, 'it should be equal to the sum of corrected high and low sequence divided by 2');

  actual = items['id-3'];
  expected = mockedItems[3].gallerySequence + 10;
  t.equal(actual, expected, 'it should auto-correct item on third index');
  t.end();
});

test('getUpdatedItemSequenceNumbers: move item from last index to fifth index and test for auto-corrected sequence', (t) => {
  const items = getUpdatedItemSequenceNumbers(9, 5, mockedItems);
  let actual = items['id-5'];
  let expected = mockedItems[5].gallerySequence - 10;
  t.equal(actual, expected, 'it should autocorrect the sequence on fifth index');

  actual = items['id-9'];
  const lowSequence = items['id-5'];
  const highSequence = mockedItems[4].gallerySequence;
  expected = Math.ceil((highSequence + lowSequence) / 2);
  t.equal(actual, expected, 'it should be equal to the sum of corrected low and high sequence divided by 2');

  actual = items['id-6'];
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct item on sixth index');
  t.end();
});

test('getUpdatedItemSequenceNumbers: move item from seventh index to second index', (t) => {
  const items = getUpdatedItemSequenceNumbers(7, 2, mockedItems);
  let actual = items['id-7'];
  let expected = Math.ceil((mockedItems[1].gallerySequence + mockedItems[2].gallerySequence) / 2);
  t.equal(actual, expected, 'it should have a sequence value between index 1 and 2');

  actual = Object.keys(items).length;
  expected = 1;
  t.equal(actual, expected, 'it should only have the sequence value of the moved item');

  t.end();
});


test('getUpdatedItemSequenceNumbers: move item from first index to sixth index', (t) => {
  const items = getUpdatedItemSequenceNumbers(0, 6, mockedItems);
  let actual = items['id-7'];
  let expected = mockedItems[7].gallerySequence - 10;
  t.equal(actual, expected, 'it should autocorrect low sequence of seventh index item');

  actual = items['id-6'];
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct high sequence of sixth index item');

  actual = items['id-0'];
  const highSequence = mockedItems[6].gallerySequence;
  const lowSequence = items['id-7'];
  expected = Math.ceil((highSequence + lowSequence) / 2);
  t.equal(actual, expected, 'it should be equal to the sum of corrected low and high sequence divided by 2');

  actual = items['id-8'];
  expected = items['id-7'] - 10;
  t.equal(actual, expected, 'it should auto-correct sequence on eight index since it should be lower');

  actual = items['id-9'];
  expected = undefined;
  t.equal(actual, expected, 'it should NOT auto-correct sequence on last index');
  t.end();
});
