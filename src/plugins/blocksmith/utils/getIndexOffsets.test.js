import test from 'tape';
import { List, Map } from 'immutable';
import { ContentBlock, ContentState, EditorState, genKey } from 'draft-js';
import { blockTypes } from '../constants';
import getIndexOffsets from './getIndexOffsets';

test('Blocksmith:util:convertToCanvasBlocks:getIndexOffsets', (t) => {
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    ContentState.createFromBlockArray([
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [0, 0];
  let actual;
  let expected;
  indexOffsets.forEach((offset, index) => {
    actual = offset;
    expected = expectedArray[index];
    t.equal(actual, expected, 'It should derive the correct index offsets.');
  });

  t.end();
});

test('Blocksmith:util:convertToCanvasBlocks:getIndexOffsets', (t) => {
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    ContentState.createFromBlockArray([
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.ORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [0, 0];
  let actual;
  let expected;
  indexOffsets.forEach((offset, index) => {
    actual = offset;
    expected = expectedArray[index];
    t.equal(actual, expected, 'It should derive the correct index offsets.');
  });

  t.end();
});

test('Blocksmith:util:getIndexOffsets', (t) => {
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    ContentState.createFromBlockArray([
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.ORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.ORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [1, 1];
  let actual;
  let expected;
  indexOffsets.forEach((offset, index) => {
    actual = offset;
    expected = expectedArray[index];
    t.equal(actual, expected, 'It should derive the correct index offsets.');
  });

  t.end();
});

test('Blocksmith:util:getIndexOffsets', (t) => {
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    ContentState.createFromBlockArray([
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [0, 0, 1];
  let actual;
  let expected;
  indexOffsets.forEach((offset, index) => {
    actual = offset;
    expected = expectedArray[index];
    t.equal(actual, expected, 'It should derive the correct index offsets.');
  });

  t.end();
});

test('Blocksmith:util:getIndexOffsets', (t) => {
  let editorState = EditorState.createEmpty();
  editorState = EditorState.push(
    editorState,
    ContentState.createFromBlockArray([
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.ORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.ORDERED_LIST_ITEM,
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: blockTypes.UNSTYLED,
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [0, 0, 2, 3];
  let actual;
  let expected;
  indexOffsets.forEach((offset, index) => {
    actual = offset;
    expected = expectedArray[index];
    t.equal(actual, expected, 'It should derive the correct index offsets.');
  });

  t.end();
});
