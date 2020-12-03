import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import { blockTypes } from '../constants';
import deleteListBlock from './deleteListBlock';

let editorState = EditorState.createEmpty();
const block1Data = {
  key: genKey(),
  type: blockTypes.UNORDERED_LIST_ITEM,
  text: 'i am block 1',
  characterList: List(),
};
const block1 = new ContentBlock(block1Data);

const block2Data = {
  key: genKey(),
  type: blockTypes.UNORDERED_LIST_ITEM,
  text: 'i am block 2',
  characterList: List(),
};
const block2 = new ContentBlock(block2Data);

const block3Data = {
  key: genKey(),
  type: blockTypes.UNORDERED_LIST_ITEM,
  text: 'i am block 3',
  characterList: List(),
};
const block3 = new ContentBlock(block3Data);

const block4Data = {
  key: genKey(),
  type: blockTypes.UNSTYLED,
  text: 'i am block 4',
  characterList: List(),
};
const block4 = new ContentBlock(block4Data);

const block5Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 5',
  characterList: List(),
};
const block5 = new ContentBlock(block5Data);

const block6Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 6',
  characterList: List(),
};
const block6 = new ContentBlock(block6Data);

const block7Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 7',
  characterList: List(),
};
const block7 = new ContentBlock(block7Data);

const block8Data = {
  key: genKey(),
  type: blockTypes.ORDERED_LIST_ITEM,
  text: 'i am block 8',
  characterList: List(),
};
const block8 = new ContentBlock(block8Data);

const block9Data = {
  key: genKey(),
  type: 'derp',
  text: 'i am block 8',
  characterList: List(),
};
const block9 = new ContentBlock(block9Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([
    block1,
    block2,
    block3,
    block4,
    block5,
    block6,
    block7,
    block8,
    block9,
  ]),
);

test('Blocksmith:util:deleteListBlock', (t) => {
  let actual = editorState.getCurrentContent().getBlocksAsArray().length;
  let expected = 9;
  t.equal(actual, expected, 'It should report the correct initial number of blocks.');

  actual = editorState.getCurrentContent().getBlocksAsArray().map((block) => block.getKey());
  expected = [block1, block2, block3, block4, block5, block6, block7, block8, block9]
    .map((block) => block.getKey());
  t.deepEqual(actual, expected, 'It should report the correct initial keys for the blocks.');

  editorState = EditorState.push(
    editorState,
    deleteListBlock(editorState.getCurrentContent(), block1Data.key), // delete by block key
  );
  actual = editorState.getCurrentContent().getBlocksAsArray().length;
  expected = 6;
  t.equal(actual, expected, 'It should report the correct number of blocks after deleting by key.');

  actual = editorState.getCurrentContent().getBlocksAsArray().map((block) => block.getKey());
  expected = [block4, block5, block6, block7, block8, block9].map((block) => block.getKey());
  t.deepEqual(actual, expected, 'It should report the correct keys for the blocks after deleting by key.');

  editorState = EditorState.push(
    editorState,
    deleteListBlock(editorState.getCurrentContent(), block8), // delete by block
  );
  actual = editorState.getCurrentContent().getBlocksAsArray().length;
  expected = 2;
  t.equal(actual, expected, 'It should report the correct number of blocks after deleting by block.');

  actual = editorState.getCurrentContent().getBlocksAsArray().map((block) => block.getKey());
  expected = [block4, block9].map((block) => block.getKey());
  t.deepEqual(actual, expected, 'It should report the correct keys for the blocks after deleting by block.');

  t.end();
});
