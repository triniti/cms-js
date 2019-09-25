import test from 'tape';
import deepFreeze from 'deep-freeze';
import getBlocksmith from './getBlocksmith';

test('Blocksmith:selector:getBlocksmith', (t) => {
  const initState = {
    blocksmith: {},
  };
  const id = '18ad9d49-de88-4821-85e7-e8c038c5abea';
  const editorState = 'thylacine';

  const testState1 = {
    blocksmith: {
      [id]: editorState,
    },
  };

  deepFreeze(initState);
  let actual = getBlocksmith(initState, id);
  let expected = null;
  t.deepEqual(actual, expected, 'it should return null if there is no EditorState for the article id');

  deepFreeze(testState1);
  actual = getBlocksmith(testState1, id);
  expected = editorState;
  t.deepEqual(actual, expected, 'it should return the EditorState for the article id');

  t.end();
});
