import test from 'tape';
import TextBlockV1 from '@triniti/acme-schemas/acme/canvas/block/TextBlockV1';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

const blocks = [
  TextBlockV1.create()
    .set('text', '<p>wtf</p>')
    .set('updated_date', new Date('2020/11/02')),
];

const editorState = convertToEditorState(blocks);

test('Blocksmith:util:convert:convertToEditorState', (t) => {
  let block;
  let actual;
  let expected;
  const draftBlocks = editorState.getCurrentContent().getBlocksAsArray();
  draftBlocks.forEach((draftBlock, index) => {
    block = blocks[index];
    if (block.has('updated_date')) {
      actual = block.get('updated_date');
      expected = draftBlock.getData().get('canvasBlock').get('updated_date');
      t.equal(actual, expected, 'updated_date should be the same in either context');
    }
    switch (block.schema().toString().replace(/:\d-\d-\d$/, '')) {
      case 'pbj:acme:canvas:block:text-block':
        actual = block.get('text');
        expected = `<p>${draftBlock.getText()}</p>`;
        t.equal(actual, expected, 'text should be the same in either context');
        break;
      default:
        break;
    }
  });

  t.end();
});

test('Blocksmith:util:convert:convertToCanvasBlocks', (t) => {
  let actual;
  let expected;
  const canvasBlocks = convertToCanvasBlocks(editorState);
  canvasBlocks.forEach((block, index) => {
    actual = block.get('etag');
    expected = blocks[index].get('etag');
    t.equal(actual, expected, 'After being converted to editorState and back, the etag should be the same');
  });

  t.end();
});
