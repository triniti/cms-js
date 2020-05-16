import test from 'tape';
import { EditorState } from 'draft-js';
import { actionTypes } from '../constants';
import storeEditor from './storeEditor';

test('Blocksmith:action:storeEditor', (t) => {
  const formName = 'cryptonomicon';
  const editorState = EditorState.createEmpty();
  const isDirty = true;

  const actual = storeEditor(formName, editorState, isDirty);
  const expected = {
    type: actionTypes.EDITOR_STORED,
    formName,
    editorState,
    isDirty,
  };

  t.same(actual, expected, 'it should create an EDITOR_STORED action with a formName.');
  t.end();
});
