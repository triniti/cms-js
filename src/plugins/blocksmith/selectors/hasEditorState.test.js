import test from 'tape';
import hasEditorState from './hasEditorState';

test('Blocksmith:selector:hasEditorState', (t) => {
  const id = '18ad9d49-de88-4821-85e7-e8c038c5abea';
  const state = {
    blocksmith: {},
  };

  let actual = hasEditorState(state, id);
  let expected = false;
  t.false(actual, expected, 'it should return false when there is no EditorState for an article id in the state');

  state.blocksmith = { [id]: { editorState: 'some stuff' } };

  actual = hasEditorState(state, id);
  expected = true;
  t.true(actual, expected, 'it should return true when there is EditorState for an article id in the state');

  t.end();
});
