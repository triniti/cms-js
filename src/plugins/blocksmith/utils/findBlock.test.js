import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import { blockTypes } from '../constants';
import findBlock from './findBlock';

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
  type: blockTypes.UNSTYLED,
  text: 'i am block 2',
  characterList: List(),
};
const block2 = new ContentBlock(block2Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([block1, block2]),
);

test('Blocksmith:util:findBlock', (t) => {
  let actual = findBlock(editorState.getCurrentContent(), 0);
  let expected = block1;
  t.equal(actual, expected, 'It should return a block by index.');

  actual = findBlock(editorState.getCurrentContent(), 10);
  expected = undefined;
  t.equal(actual, expected, 'It should return undefined when trying to find a block by index that does not exist.');

  actual = findBlock(editorState.getCurrentContent(), block2Data.key);
  expected = block2;
  t.equal(actual, expected, 'It should return a block by key.');

  actual = findBlock(editorState.getCurrentContent(), 'a');
  expected = undefined;
  t.equal(actual, expected, 'It should return undefined when trying to find a block by key that does not exist.');

  actual = findBlock(editorState.getCurrentContent(), block2);
  expected = block2;
  t.equal(actual, expected, 'It should return a block by ContentBlock.');

  actual = findBlock(editorState.getCurrentContent(), {});
  expected = undefined;
  t.equal(actual, expected, 'It should return undefined when trying to find a block by object that is not a ContentBlock.');

  actual = findBlock(editorState.getCurrentContent(), () => {});
  expected = undefined;
  t.equal(actual, expected, 'It should return undefined when trying to find a block by an invalid id.');

  t.end();
});
