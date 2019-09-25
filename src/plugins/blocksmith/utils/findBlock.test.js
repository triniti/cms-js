import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import findBlock from './findBlock';

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
  type: 'unstyled',
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

  t.throws(
    () => findBlock(editorState.getCurrentContent(), 10),
    new Error(`there is no block for index [${10}]`),
    'It should throw an error when trying to find a block by index that does not exist.',
  );

  actual = findBlock(editorState.getCurrentContent(), block2Data.key);
  expected = block2;
  t.equal(actual, expected, 'It should return a block by key.');

  t.throws(
    () => findBlock(editorState.getCurrentContent(), 'a'),
    new Error('there is no block for key [a]'),
    'It should throw an error when trying to find a block by key that does not exist.',
  );

  actual = findBlock(editorState.getCurrentContent(), block2);
  expected = block2;
  t.equal(actual, expected, 'It should return a block by ContentBlock.');

  t.throws(
    () => findBlock(editorState.getCurrentContent(), {}),
    new Error('provided block object is not a ContentBlock'),
    'It should throw an error when trying to find a block by object that is not a ContentBlock.',
  );

  t.throws(
    () => findBlock(editorState.getCurrentContent(), () => {}),
    new Error(`unable to find block with provided id [${() => {}}]`),
    'It should throw an error when trying to find a block by an invalid id.',
  );

  t.end();
});
