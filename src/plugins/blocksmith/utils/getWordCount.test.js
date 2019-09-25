import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import getWordCount from './getWordCount';

test('Blocksmith:util:getWordCount [null editorState]', (t) => {
  const actual = getWordCount(null);
  const expected = 0;
  t.same(actual, expected, 'It should return 0.');

  t.end();
});

test('Blocksmith:util:getWordCount [undefined  editorState]', (t) => {
  const actual = getWordCount();
  const expected = 0;
  t.same(actual, expected, 'It should return 0.');

  t.end();
});

let editorState1 = EditorState.createEmpty();
editorState1 = EditorState.push(
  editorState1,
  ContentState.createFromBlockArray([]),
);

test('Blocksmith:util:getWordCount [empty editorState]', (t) => {
  const actual = getWordCount(editorState1);
  const expected = 0;
  t.same(actual, expected, 'It should return correct word count.');

  t.end();
});

let editorState2 = EditorState.createEmpty();
const block1Data = {
  key: genKey(),
  type: 'unstyled',
  text: 'i am block 1',
};
const block1 = new ContentBlock(block1Data);
const block2Data = {
  key: genKey(),
  type: 'unstyled',
  text: 'i am block 2',
};
const block2 = new ContentBlock(block2Data);

const block3Data = {
  key: genKey(),
  type: 'ordered-list-item',
  characterList: List(),
};
const block3 = new ContentBlock(block3Data);

editorState2 = EditorState.push(
  editorState2,
  ContentState.createFromBlockArray([block1, block2, block3]),
);

test('Blocksmith:util:getWordCount [with text content editorState]', (t) => {
  const actual = getWordCount(editorState2);
  const expected = 8;
  t.same(actual, expected, 'It should return correct word count.');

  t.end();
});
