import test from 'tape';
import deepFreeze from 'deep-freeze';
import { convertFromHTML, ContentState, EditorState } from 'draft-js';
import reducer, { initialState } from './';
import cleanEditor from '../actions/cleanEditor';
import destroyEditor from '../actions/destroyEditor';
import dirtyEditor from '../actions/dirtyEditor';
import storeEditor from '../actions/storeEditor';

test('Blocksmith:reducer:index:cleanEditor', (t) => {
  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  const emptyEditorState = EditorState.createEmpty();
  deepFreeze(emptyEditorState);
  const formName = 'someFormName';

  let actual = reducer(undefined, storeEditor(formName, emptyEditorState));
  let expected = { [formName]: { editorState: emptyEditorState } };
  t.deepEqual(actual, expected, 'it should initialize an editorState for a formName if there is no previous state');

  actual = reducer(
    { [formName]: { editorState: emptyEditorState } },
    cleanEditor(formName),
  );
  expected = { [formName]: { editorState: emptyEditorState, isDirty: false } };
  t.deepEqual(actual, expected, 'it should update the isDirty flag for a formName if there is previous state');

  t.end();
});

test('Blocksmith:reducer:index:destroyEditor', (t) => {
  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  const emptyEditorState = EditorState.createEmpty();
  deepFreeze(emptyEditorState);
  const formName = 'someFormName';

  let actual = reducer(undefined, storeEditor(formName, emptyEditorState));
  let expected = { [formName]: { editorState: emptyEditorState } };
  t.deepEqual(actual, expected, 'it should initialize a current EditorState for a formName if there is no previous state');

  actual = reducer(
    { [formName]: { editorState: emptyEditorState } },
    destroyEditor(formName),
  );
  expected = {};
  t.deepEqual(actual, expected, 'it should delete the editorState for the formName');

  t.end();
});

test('Blocksmith:reducer:index:dirtyEditor', (t) => {
  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  const emptyEditorState = EditorState.createEmpty();
  deepFreeze(emptyEditorState);
  const formName = 'someFormName';

  let actual = reducer(undefined, storeEditor(formName, emptyEditorState));
  let expected = { [formName]: { editorState: emptyEditorState } };
  t.deepEqual(actual, expected, 'it should initialize a current EditorState for a formName if there is no previous state');

  actual = reducer(
    { [formName]: { editorState: emptyEditorState } },
    dirtyEditor(formName),
  );
  expected = { [formName]: { editorState: emptyEditorState, isDirty: true } };
  t.deepEqual(actual, expected, 'it should update the isDirty flag for a formName id if there is previous state');

  t.end();
});

test('Blocksmith:reducer:index:storeEditor', (t) => {
  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  const emptyEditorState = EditorState.createEmpty();
  deepFreeze(emptyEditorState);
  const formName = 'someFormName';

  let actual = reducer(undefined, storeEditor(formName, emptyEditorState));
  let expected = { [formName]: { editorState: emptyEditorState } };
  t.deepEqual(actual, expected, 'it should initialize a current EditorState for a formName if there is no previous state');

  const html = '<b>Bold text</b>,<i>Italic text</i><br /><br /><a href="http://www.google.com">Example link</a>';

  const blocksFromHTML = convertFromHTML(html);
  const filledEditorState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );
  deepFreeze(filledEditorState);

  actual = reducer(
    { [formName]: { editorState: emptyEditorState } },
    storeEditor(formName, filledEditorState),
  );
  expected = { [formName]: { editorState: filledEditorState } };
  t.deepEqual(actual, expected, 'it should update the current EditorState for a formName if there is previous state');

  t.end();
});
