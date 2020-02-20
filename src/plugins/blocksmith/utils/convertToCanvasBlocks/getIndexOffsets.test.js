import test from 'tape';
import { List, Map } from 'immutable';
import { ContentBlock, ContentState, EditorState, genKey } from 'draft-js';
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
        type: 'unstyled',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unstyled',
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
        type: 'ordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unstyled',
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
        type: 'ordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'ordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unstyled',
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
        type: 'unstyled',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unstyled',
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [0, 1, 1];
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
        type: 'unstyled',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'ordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'ordered-list-item',
      }),
      new ContentBlock({
        characterList: new List([]),
        data: new Map({}),
        key: genKey(),
        text: 'yay',
        type: 'unstyled',
      }),
    ]),
  );
  const indexOffsets = getIndexOffsets(editorState.getCurrentContent().getBlocksAsArray());
  const expectedArray = [0, 2, 3, 3];
  let actual;
  let expected;
  indexOffsets.forEach((offset, index) => {
    actual = offset;
    expected = expectedArray[index];
    t.equal(actual, expected, 'It should derive the correct index offsets.');
  });

  t.end();
});
