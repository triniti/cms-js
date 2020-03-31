import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import { blockTypes } from '../constants';
import isBlockEmpty from './isBlockEmpty';

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
  text: '',
  characterList: List(),
};
const block2 = new ContentBlock(block2Data);

const block3Data = {
  key: genKey(),
  type: blockTypes.UNSTYLED,
  text: '    ',
  characterList: List(),
};
const block3 = new ContentBlock(block3Data);

const block4Data = {
  key: genKey(),
  type: blockTypes.ATOMIC,
  text: ' ',
  characterList: List(),
};
const block4 = new ContentBlock(block4Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([block1, block2, block3, block4]),
);

test('Blocksmith:util:isBlockEmpty', (t) => {
  t.false(isBlockEmpty(editorState.getCurrentContent().getBlocksAsArray()[0]), 'It should say that an unstyled block with text is not empty');
  t.true(isBlockEmpty(editorState.getCurrentContent().getBlocksAsArray()[1]), 'It should say that an unstyed block with no text is empty');
  t.true(isBlockEmpty(editorState.getCurrentContent().getBlocksAsArray()[2]), 'It should say that an unstyled block with only spaces is empty');
  t.false(isBlockEmpty(editorState.getCurrentContent().getBlocksAsArray()[3]), 'It should say that an atomic block is not empty');

  t.end();
});
