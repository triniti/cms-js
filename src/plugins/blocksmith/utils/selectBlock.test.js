import { ContentBlock, ContentState, EditorState, genKey } from 'draft-js';
import { List, Map } from 'immutable';
import test from 'tape';
import { blockTypes } from '../constants';
import selectBlock, { selectionTypes } from './selectBlock';

const generateRandomLengthString = () => {
  let text = '';
  let randomText;
  for (let i = 0; i < 3; i += 1) {
    randomText = Math.random().toString(36).substring(7);
    text = `${text}${randomText.substr(0, Math.floor((Math.random() * randomText.length) + 1))}`;
  }
  return text;
};

test('Blocksmith:util:selectBlock:unstyled', (t) => {
  const key = genKey();
  const text = generateRandomLengthString();
  const contentState = ContentState.createFromBlockArray([
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: genKey(),
      text: 'what',
      type: blockTypes.UNSTYLED,
    }),
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key,
      text,
      type: blockTypes.UNSTYLED,
    }),
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: genKey(),
      text: 'thylacine',
      type: blockTypes.UNSTYLED,
    }),
  ]);
  const blocks = contentState.getBlocksAsArray();
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    contentState,
  );
  let selectionState = editorState.getSelection();
  let actual = selectionState.getAnchorKey();
  let expected = blocks[0].getKey();
  t.equal(actual, expected, 'before selecting, the first block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = blocks[0].getKey();
  t.equal(actual, expected, 'before selecting, the first block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = 0;
  t.equal(actual, expected, 'before selecting, the anchorOffset should be 0');

  actual = selectionState.getFocusOffset();
  expected = 0;
  t.equal(actual, expected, 'before selecting, the focusOffset should be 0');

  editorState = selectBlock(editorState, key);
  selectionState = editorState.getSelection();
  actual = selectionState.getAnchorKey();
  expected = key;
  t.equal(actual, expected, 'after selecting ALL, the block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = key;
  t.equal(actual, expected, 'after selecting ALL, the block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = 0;
  t.equal(actual, expected, 'after selecting ALL, the anchorOffset should be 0');

  actual = selectionState.getFocusOffset();
  expected = text.length;
  t.equal(actual, expected, `after selecting ALL, the focusOffset should be ${expected}`);

  editorState = selectBlock(editorState, key, selectionTypes.START);
  selectionState = editorState.getSelection();
  actual = selectionState.getAnchorKey();
  expected = key;
  t.equal(actual, expected, 'after selecting START, the block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = key;
  t.equal(actual, expected, 'after selecting START, the block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = 0;
  t.equal(actual, expected, 'after selecting START, the anchorOffset should be 0');

  actual = selectionState.getFocusOffset();
  expected = 0;
  t.equal(actual, expected, 'after selecting START, the focusOffset should be 0');

  editorState = selectBlock(editorState, key, selectionTypes.END);
  selectionState = editorState.getSelection();
  actual = selectionState.getAnchorKey();
  expected = key;
  t.equal(actual, expected, 'after selecting END, the block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = key;
  t.equal(actual, expected, 'after selecting END, the block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = text.length;
  t.equal(actual, expected, `after selecting END, the anchorOffset should be ${expected}`);

  actual = selectionState.getFocusOffset();
  expected = text.length;
  t.equal(actual, expected, `after selecting END, the focusOffset should be ${expected}`);

  t.end();
});

test('Blocksmith:util:selectBlock:ordered-list-item', (t) => {
  const keys = [];
  const texts = [];
  for (let i = 0; i < 3; i += 1) {
    keys.push(genKey());
    texts.push(generateRandomLengthString());
  }

  const contentState = ContentState.createFromBlockArray([
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: genKey(),
      text: 'what',
      type: blockTypes.UNSTYLED,
    }),
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: keys[0],
      text: texts[0],
      type: blockTypes.ORDERED_LIST_ITEM,
    }),
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: keys[1],
      text: texts[1],
      type: blockTypes.ORDERED_LIST_ITEM,
    }),
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: keys[2],
      text: texts[2],
      type: blockTypes.ORDERED_LIST_ITEM,
    }),
    new ContentBlock({
      characterList: new List([]),
      data: new Map({}),
      key: genKey(),
      text: 'thylacine',
      type: blockTypes.UNSTYLED,
    }),
  ]);
  const blocks = contentState.getBlocksAsArray();
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    contentState,
  );
  let selectionState = editorState.getSelection();
  let actual = selectionState.getAnchorKey();
  let expected = blocks[0].getKey();
  t.equal(actual, expected, 'before selecting, the first block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = blocks[0].getKey();
  t.equal(actual, expected, 'before selecting, the first block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = 0;
  t.equal(actual, expected, 'before selecting, the anchorOffset should be 0');

  actual = selectionState.getFocusOffset();
  expected = 0;
  t.equal(actual, expected, 'before selecting, the focusOffset should be 0');

  editorState = selectBlock(editorState, keys[1]);
  selectionState = editorState.getSelection();
  actual = selectionState.getAnchorKey();
  expected = keys[0];
  t.equal(actual, expected, 'after selecting ALL, the first list block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = keys[2];
  t.equal(actual, expected, 'after selecting ALL, the last block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = 0;
  t.equal(actual, expected, 'after selecting ALL, the anchorOffset should be 0');

  actual = selectionState.getFocusOffset();
  expected = texts[2].length;
  t.equal(actual, expected, `after selecting ALL, the focusOffset should be ${expected}`);

  editorState = selectBlock(editorState, keys[2], selectionTypes.START);
  selectionState = editorState.getSelection();
  actual = selectionState.getAnchorKey();
  expected = keys[0];
  t.equal(actual, expected, 'after selecting START, the first block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = keys[0];
  t.equal(actual, expected, 'after selecting START, the first block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = 0;
  t.equal(actual, expected, 'after selecting START, the anchorOffset should be 0');

  actual = selectionState.getFocusOffset();
  expected = 0;
  t.equal(actual, expected, 'after selecting START, the focusOffset should be 0');

  editorState = selectBlock(editorState, keys[0], selectionTypes.END);
  selectionState = editorState.getSelection();
  actual = selectionState.getAnchorKey();
  expected = keys[2];
  t.equal(actual, expected, 'after selecting END, the last block\'s key should be the anchorKey');

  actual = selectionState.getFocusKey();
  expected = keys[2];
  t.equal(actual, expected, 'after selecting END, the last block\'s key should be the focusKey');

  actual = selectionState.getAnchorOffset();
  expected = texts[2].length;
  t.equal(actual, expected, `after selecting END, the anchorOffset should be ${expected}`);

  actual = selectionState.getFocusOffset();
  expected = texts[2].length;
  t.equal(actual, expected, `after selecting END, the focusOffset should be ${expected}`);

  t.end();
});
