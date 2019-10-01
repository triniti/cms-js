import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import isBlockAList from './isBlockAList';

let editorState = EditorState.createEmpty();
const block1Data = {
  key: genKey(),
  type: 'unstyled',
  text: 'i am block 1',
  characterList: List(),
};
const block1 = new ContentBlock(block1Data);

const block2Data = {
  key: genKey(),
  type: 'ordered-list-item',
  text: 'i am block 2',
  characterList: List(),
};
const block2 = new ContentBlock(block2Data);

const block3Data = {
  key: genKey(),
  type: 'unordered-list-item',
  text: 'i am block 3',
  characterList: List(),
};
const block3 = new ContentBlock(block3Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([block1, block2, block3]),
);

test('Blocksmith:util:isBlockAList', (t) => {
  t.false(isBlockAList(editorState.getCurrentContent().getBlocksAsArray()[0]), 'It should say that an unstyled block is not a list');
  t.true(isBlockAList(editorState.getCurrentContent().getBlocksAsArray()[1]), 'It should say that an ordered-list-item block is a list');
  t.true(isBlockAList(editorState.getCurrentContent().getBlocksAsArray()[2]), 'It should say that an unordered-list-item block is a list');

  t.end();
});
