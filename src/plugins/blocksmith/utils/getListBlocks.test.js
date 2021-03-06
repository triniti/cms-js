import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import { blockTypes } from '../constants';
import getListBlocks from './getListBlocks';

let editorState = EditorState.createEmpty();
const block1Data = {
  key: genKey(),
  type: blockTypes.UNSTYLED,
  text: 'i am block 1',
  characterList: List(),
};
const block1 = new ContentBlock(block1Data);

const block2Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 2',
  characterList: List(),
};
const block2 = new ContentBlock(block2Data);

const block3Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 3',
  characterList: List(),
};
const block3 = new ContentBlock(block3Data);

const block4Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 4',
  characterList: List(),
};
const block4 = new ContentBlock(block4Data);

const block5Data = {
  key: genKey(),
  type: blockTypes.UNSTYLED,
  text: 'i am block 4',
  characterList: List(),
};
const block5 = new ContentBlock(block5Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([block1, block2, block3, block4, block5]),
);

test('Blocksmith:util:getListBlocks', (t) => {
  let actual = getListBlocks(editorState.getCurrentContent(), block2Data.key);
  let expected = [block2, block3, block4];
  t.deepEqual(actual, expected, 'It should return all the list blocks in order when given the first list block.');

  actual = getListBlocks(editorState.getCurrentContent(), block4Data.key);
  expected = [block2, block3, block4];
  t.deepEqual(actual, expected, 'It should return all the list blocks in order when given the last list block.');

  actual = getListBlocks(editorState.getCurrentContent(), block3Data.key);
  expected = [block2, block3, block4];
  t.deepEqual(actual, expected, 'It should return all the list blocks in order when given a block id that is not first or last.');

  t.end();
});
