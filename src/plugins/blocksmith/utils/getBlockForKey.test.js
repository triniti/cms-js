import test from 'tape';
import { List } from 'immutable';
import {
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from 'draft-js';
import { blockTypes } from '../constants';
import getBlockForKey from './getBlockForKey';

let editorState = EditorState.createEmpty();
const block1Data = {
  key: genKey(),
  type: blockTypes.UNSTYLED,
  text: 'i am block 1',
  characterList: List(),
};
const block1 = new ContentBlock(block1Data);

editorState = EditorState.push(
  editorState,
  ContentState.createFromBlockArray([block1]),
);

test('Blocksmith:util:getBlockForKey', (t) => {
  let actual = getBlockForKey(editorState.getCurrentContent(), block1Data.key);
  let expected = block1;
  t.equal(actual, expected, 'It should return a block by key.');

  t.throws(
    () => getBlockForKey(editorState.getCurrentContent(), 10),
    new Error('key [10] is not a string'),
    'It should throw an error when trying to find a block by non-string key.',
  );

  actual = getBlockForKey(editorState.getCurrentContent(), 'asdf');
  expected = undefined;
  t.equal(actual, expected, 'It should return undefined when the provided key does not match a ContentBlock in the ContentState.');

  t.end();
});
