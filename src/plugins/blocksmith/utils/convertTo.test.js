import { convertFromRaw, EditorState } from 'draft-js';
import ImageBlockV1 from '@triniti/acme-schemas/acme/canvas/block/ImageBlockV1';
import isNumber from 'lodash/isNumber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import test from 'tape';
import TextBlockV1 from '@triniti/acme-schemas/acme/canvas/block/TextBlockV1';
import VideoBlockV1 from '@triniti/acme-schemas/acme/canvas/block/VideoBlockV1';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';
import getIndexOffsets from './getIndexOffsets';

/**
 * The "not simple" ones do not have their editorState tested. They could, but the entities
 * and inline styles are very granular and complicated.
 */
const blocks = [
  {
    isSimple: true,
    block: TextBlockV1.create()
      .set('text', '<p>wtf</p>')
      .set('updated_date', new Date('2010/01/01')),
  },
  {
    isSimple: false,
    block: TextBlockV1.create() // eslint-disable-next-line no-useless-escape
      .set('text', '<p><u>w</u><del><u>h</u></del><a href=\"https://www.google.com\"><del><u>y</u></del><del> </del><del><em>th</em></del><del><u><em>e</em></u></del><del><u> </u></del><del><u><strong>w</strong></u></del><u><strong>h</strong></u><strong>a</strong><em><strong>t</strong></em><em> </em><span class=\"highlight-text\"><em>okee</em></span><em> </em><del><em>d</em></del></a><del><em>ok</em></del><del>ey</del></p>')
      .set('updated_date', new Date('2011/02/02')),
  },
  {
    isSimple: false,
    block: TextBlockV1.create() // eslint-disable-next-line no-useless-escape
      .set('text', '<p><ol><li>list</li><li>w<del>ha</del>t</li><li>jan 1</li><li>w<strong>h</strong><del><strong>i</strong></del><a href=\"https://www.google.com/\"><del><strong>th</strong></del><del><em><strong> lo</strong></em></del><span class=\"highlight-text\"><del><em><strong>t</strong></em></del></span><del><em><strong>s </strong></em></del><del><u><em><strong>o</strong></em></u></del></a><del><u><em><strong>f w</strong></em></u></del><u><em>eir</em></u><span class=\"highlight-text\"><u><em>d</em></u><u> st</u>uff goi</span>ng</li><li>o<u>n in th</u>e</li><li>place</li><li><span class=\"highlight-text\">w<u>oo</u><u><strong>p </strong></u></span><u><strong>d</strong></u><del><u><em><strong>e</strong></em></u></del><del><em><strong> w</strong></em></del><a href=\"https://www.google.com/\"><del><em>oo</em></del></a><del><em>p</em></del><del>d</del>y</li></ol></p>')
      .set('updated_date', new Date('2012/03/03')),
  },
  {
    isSimple: false,
    block: TextBlockV1.create() // eslint-disable-next-line no-useless-escape
      .set('text', '<p><ul><li>t<del><em>hi</em></del><del>s o</del><del><strong>n</strong></del>e</li><li>i<span class=\"highlight-text\"><em>s u</em>no<strong>rd</strong></span><strong>ere</strong>d</li><li><em>th</em><a href=\"https://www.google.com\"><em>o</em></a></li></ul></p>')
      .set('updated_date', new Date('2013/04/04')),
  },
  {
    isSimple: true,
    block: ImageBlockV1.create()
      .set('node_ref', NodeRef.fromString('acme:image-asset:image_jpeg_20200211_293d14038daa48c786ffbb2fbee64236'))
      .set('updated_date', new Date('2014/05/05')),
  },
];

const editorState = convertToEditorState(blocks.map((b) => b.block));

test('Blocksmith:util:convert:convertToEditorState', (t) => {
  let block;
  let draftBlock;
  let actual;
  let expected;
  const draftBlocks = editorState.getCurrentContent().getBlocksAsArray();
  const indexOffsets = getIndexOffsets(draftBlocks);
  for (let i = 0; i < blocks.length; i += 1) {
    if (!blocks[i].isSimple) {
      continue;
    }
    const offset = isNumber(indexOffsets[i])
      ? indexOffsets[i]
      : indexOffsets[indexOffsets.length - 1];
    draftBlock = draftBlocks[i + offset];
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

/**
 * The following test simulates the editorState being converted to canvas blocks while it is in
 * an invalid state. Specifically, there is a text block that has a type of "atomic", which makes
 * no sense. We still don't know how the editorState could get into this state, but we know that
 * it can and has; the data below used to seed the editorState is from actual data of a user
 * experiencing this problem. So this test is a confirmation of the edits we made to
 * convertToCanvasBlocks that correct it.
 */

test('Blocksmith:util:convert:convertToCanvasBlocks [invalid editorState]', (t) => {
  const videoSchema = 'pbj:acme:canvas:block:video-block:1-0-0';
  const videoEtag = '3ab2ac65a494a40a70f4dcb9187c08e2';
  const videoNodeRef = 'acme:video:8152d96b-71ea-526b-998e-605e72412b0a';

  const textBlockSchema = 'pbj:acme:canvas:block:text-block:1-0-0';
  const atomicText = 'oh look at me i am a text block but my type is atomic. this is not good...';
  const unstyledText = 'i am a legit text block with the correct type.';

  const canvasBlocks = convertToCanvasBlocks(EditorState.createWithContent(convertFromRaw({
    entityMap: {},
    blocks: [
      {
        key: '3r9di',
        type: 'atomic',
        text: ' ',
        characterList: [],
        depth: 0,
        data: {
          canvasBlock: VideoBlockV1.create()
            .set('etag', videoEtag)
            .set('node_ref', NodeRef.fromString(videoNodeRef)),
        },
      },
      {
        key: 'fqomp',
        type: 'atomic',
        text: atomicText,
        characterList: atomicText.split('').map(() => ({
          style: [],
          entity: null,
        })),
        depth: 0,
        data: {},
      },
      {
        key: '7noe8',
        type: 'atomic',
        text: atomicText,
        characterList: atomicText.split('').map(() => ({
          style: [],
          entity: null,
        })),
        depth: 0,
        data: {
          canvasBlock: TextBlockV1.create()
            .set('text', `<p>${atomicText}</p>`),
        },
      },
      {
        key: '8chb0',
        type: 'unstyled',
        text: unstyledText,
        characterList: unstyledText.split('').map(() => ({
          style: [],
          entity: null,
        })),
        depth: 0,
        data: {},
      },
      {
        key: '9snjb',
        type: 'unstyled',
        text: unstyledText,
        characterList: unstyledText.split('').map(() => ({
          style: [],
          entity: null,
        })),
        depth: 0,
        data: {
          canvasBlock: TextBlockV1.create()
            .set('text', `<p>${unstyledText}</p>`),
        },
      },
    ],
  })));

  let actual = canvasBlocks[0].get('etag');
  let expected = videoEtag;
  t.equal(actual, expected, 'the valid atomic block should have the correct etag');

  actual = canvasBlocks[0].schema().toString();
  expected = videoSchema;
  t.equal(actual, expected, 'the valid atomic block should have the correct schema');

  actual = canvasBlocks[0].get('node_ref').toString();
  expected = videoNodeRef;
  t.equal(actual, expected, 'the valid atomic block should have the correct node_ref');

  actual = canvasBlocks[1].get('text');
  expected = `<p>${atomicText}</p>`;
  t.equal(actual, expected, 'the invalid atomic block should have the correct text');

  actual = canvasBlocks[1].schema().toString();
  expected = textBlockSchema;
  t.equal(actual, expected, 'the invalid atomic block with data payload should have the correct schema');

  actual = canvasBlocks[2].get('text');
  expected = `<p>${atomicText}</p>`;
  t.equal(actual, expected, 'the invalid atomic block with data payload should have the correct text');

  actual = canvasBlocks[2].schema().toString();
  expected = textBlockSchema;
  t.equal(actual, expected, 'the invalid atomic block should have the correct schema');

  actual = canvasBlocks[3].get('text');
  expected = `<p>${unstyledText}</p>`;
  t.equal(actual, expected, 'the valid unstyled block should have the correct text');

  actual = canvasBlocks[3].schema().toString();
  expected = textBlockSchema;
  t.equal(actual, expected, 'the valid unstyled block should have the correct schema');

  actual = canvasBlocks[4].get('text');
  expected = `<p>${unstyledText}</p>`;
  t.equal(actual, expected, 'the valid unstyled block with data payload should have the correct text');

  actual = canvasBlocks[4].schema().toString();
  expected = textBlockSchema;
  t.equal(actual, expected, 'the valid unstyled block with data payload should have the correct schema');

  actual = t.end();
});
