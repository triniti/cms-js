import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import isLastListBlock from './isLastListBlock';

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
  type: 'ordered-list-item',
  text: 'i am block 3',
  characterList: List(),
};
const block3 = new ContentBlock(block3Data);

const block4Data = {
  key: genKey(),
  type: 'unstyled',
  text: 'i am block 4',
  characterList: List(),
};
const block4 = new ContentBlock(block4Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([
    block1,
    block2,
    block3,
    block4,
  ]),
);

test('Blocksmith:util:isLastListBlock', (t) => {
  let actual = isLastListBlock(editorState.getCurrentContent(), block3);
  let expected = true;
  t.equal(actual, expected, 'It should confirm that block3 is the last list block');

  actual = isLastListBlock(editorState.getCurrentContent(), block2);
  expected = false;
  t.equal(actual, expected, 'It should confirm that block2 is NOT the last list block');

  t.throws(
    () => isLastListBlock(editorState.getCurrentContent(), block4),
    new Error(`block with key [${block3.getKey()}] is not a list block, bailing out`),
    'It should throw an error when a non-list block is provided',
  );

  t.end();
});
