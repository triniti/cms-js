import ImageBlockV1 from '@triniti/acme-schemas/acme/canvas/block/ImageBlockV1';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import test from 'tape';
import TextBlockV1 from '@triniti/acme-schemas/acme/canvas/block/TextBlockV1';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

const blocks = [
  {
    isSimple: true,
    block: TextBlockV1.create()
      .set('text', '<p>wtf</p>')
      .set('updated_date', new Date('2020/11/02')),
  },
  {
    // the entity state for all this styling and links is very complicated and would be difficult
    // to test. someday.
    isSimple: false,
    block: TextBlockV1.create() // eslint-disable-next-line no-useless-escape
      .set('text', '<p><u>w</u><del><u>h</u></del><a href=\"https://www.google.com\"><del><u>y</u></del><del> </del><del><em>th</em></del><del><u><em>e</em></u></del><del><u> </u></del><del><u><strong>w</strong></u></del><u><strong>h</strong></u><strong>a</strong><em><strong>t</strong></em><em> </em><span class=\"highlight-text\"><em>okee</em></span><em> </em><del><em>d</em></del></a><del><em>ok</em></del><del>ey</del></p>')
      .set('updated_date', new Date('2020/11/02')),
  },
  {
    isSimple: true,
    block: ImageBlockV1.create()
      .set('node_ref', NodeRef.fromString('acme:image-asset:image_jpeg_20200211_293d14038daa48c786ffbb2fbee64236'))
      .set('updated_date', new Date('2020/11/02')),
  },
];

const editorState = convertToEditorState(blocks.map((b) => b.block));

test('Blocksmith:util:convert:convertToEditorState', (t) => {
  let block;
  let draftBlock;
  let actual;
  let expected;
  const draftBlocks = editorState.getCurrentContent().getBlocksAsArray();
  for (let i = 0; i < draftBlocks.length; i += 1) {
    if (!blocks[i].isSimple) {
      continue;
    }
    draftBlock = draftBlocks[i];
    block = blocks[i].block;
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
      case 'pbj:acme:canvas:block:image-block':
        actual = block.get('node_ref');
        expected = draftBlock.getData().get('canvasBlock').get('node_ref');
        t.true(actual.equals(expected), 'node_ref should be the same in either context');
        break;
      default:
        break;
    }
  }

  t.end();
});

test('Blocksmith:util:convert:convertToCanvasBlocks', (t) => {
  let actual;
  let expected;
  const canvasBlocks = convertToCanvasBlocks(editorState);
  canvasBlocks.forEach((block, index) => {
    actual = block.get('etag');
    expected = blocks[index].block.get('etag');
    t.equal(actual, expected, 'After being converted to editorState and back, the etag should be the same');
  });

  t.end();
});
