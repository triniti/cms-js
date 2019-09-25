import test from 'tape';
import deepFreeze from 'deep-freeze';
import isBlocksmithDirty from './isBlocksmithDirty';

test('Blocksmith:selector:isBlocksmithDirty', (t) => {
  const initState = {
    blocksmith: {},
  };
  const id = '18ad9d49-de88-4821-85e7-e8c038c5abea';
  const isDirty = true;

  deepFreeze(initState);
  let actual = isBlocksmithDirty(initState, id);
  let expected = false;
  t.deepEqual(actual, expected, 'it should return false if there is no EditorState for the article id');

  const testState1 = {
    blocksmith: {
      [id]: {
        isDirty,
      },
    },
  };

  deepFreeze(testState1);
  actual = isBlocksmithDirty(testState1, id);
  expected = isDirty;
  t.deepEqual(actual, expected, 'it should return the isDirty flag for the article id');

  t.end();
});
