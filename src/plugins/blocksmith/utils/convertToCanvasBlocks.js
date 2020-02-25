import { stateToHTML } from 'draft-js-export-html';
import isNumber from 'lodash/isNumber';
import Message from '@gdbots/pbj/Message';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';
import { blockTypes, inlineStyleTypes, tokens } from '../constants';
import getIndexOffsets from './getIndexOffsets';

const CANVAS_BLOCK_TOKEN = 'CANVAS_BLOCK:';
const EMPTY_BLOCK_REGEX = /<p>(<br>)?<\/p>/;
const LIST_TAG_COUNT_REGEX = /(?:<\/?(o|u)l>)|(?:<\/?li>)/g;
const LIST_TAG_REGEX = /<(o|u)l>.+?<\/(o|u)l>/g;
const MUTANT_P_TAG_REGEX = /^<\/?p>(<\/p>)?$/;
const PADDED_CLOSING_P_TAG_REGEX = /((\s)|(&nbsp;))+<\/p>$/;
const UNNECESARY_SPAN_REGEX = /<\/span><span class="highlight-text">/g;

/**
 * Converts an EditorState instance from the DraftJs Editor into triniti canvas blocks
 *
 * @param {EditorState} editorState      - an EditorState instance of a DraftJs Editor
 * @param {boolean}     allowEmptyBlocks - whether or not to allow empty blocks. traditionally
 *                                         this util was only used to convert to canvas blocks
 *                                         in order to save them, and we don't save empty text
 *                                         blocks. but now that we are doing de/serialization
 *                                         mid-edit, it can make sense to leave them.
 *                                         convertToEditorState will detect "empty" canvas blocks
 *                                         and convert them to truly empty ContentBlocks.
 *
 * @returns {Array} an array of triniti canvas blocks
 */
export default (editorState, allowEmptyTextBlocks = false) => {
  // fixme: this could take contentState only
  const contentState = editorState.getCurrentContent();

  const options = {
    // renderer for our custom atomic blocks
    blockRenderers: {
      [blockTypes.ATOMIC]: (block) => `${CANVAS_BLOCK_TOKEN}${JSON.stringify(block.getData().get('canvasBlock'))}`,
      [blockTypes.UNSTYLED]: (block) => {
        if (allowEmptyTextBlocks && block.getText() === '') {
          return `<p>${tokens.EMPTY_BLOCK_TOKEN}</p>`;
        }
        return undefined;
      },
    },
    inlineStyles: {
      [inlineStyleTypes.HIGHLIGHT]: {
        element: 'span',
        attributes: {
          className: 'highlight-text',
        },
      },
    },
  };

  const blocks = stateToHTML(contentState, options)
    .replace(/<br>\n/g, '<br>') // consolidate br tags with newline to a single p line
    .split('\n') // split into individual blocks
    .reduce((acc, cur) => {
      if (!cur.startsWith(CANVAS_BLOCK_TOKEN)) {
        acc.push(cur);
        return acc;
      }
      const blockAsJson = JSON.parse(cur.replace(new RegExp(`^${CANVAS_BLOCK_TOKEN}`), ''));
      const block = ObjectSerializer.deserialize(blockAsJson);
      acc.push(block);
      return acc;
    }, []);

  const draftJsBlocks = contentState.getBlocksAsArray();
  const indexOffsets = getIndexOffsets(draftJsBlocks);

  const filteredNodeBlocks = blocks.map((block) => (typeof block === 'string' ? block.trim() : block));

  const lists = filteredNodeBlocks
    .filter((block) => typeof block === 'string')
    .join('')
    .match(LIST_TAG_REGEX); // match ordered and unordered list tags

  if (lists) {
    lists.forEach((list) => {
      const needle = list.slice(0, 4) === '<ol>' ? '<ol>' : '<ul>';
      const startPoint = filteredNodeBlocks.indexOf(needle);
      const count = (list.match(LIST_TAG_COUNT_REGEX).length / 2) + 1;
      // replace individual tag (ol, ul, li) entries with the complete
      // list (ie <ol><li>whatever</li></ol>)
      filteredNodeBlocks.splice(startPoint, count, list);
    });
  }

  return filteredNodeBlocks
    .map((block) => {
      if ((block instanceof Message)) {
        return block;
      }
      // The highlight spans can be pretty aggressive and unnecessary; there can be separate spans
      // for each character that is not otherwise styled the same - ie a bold and italic character
      // next to each other that are both highlighted will have two separate spans when they don't
      // need to. so remove that unnecessary stuff here.
      let normalizedText = block.replace(UNNECESARY_SPAN_REGEX, '');

      // Just makes sure each text block is a valid p tag - added this after finding the pasting
      // of br tags can result in invalid html.
      if (normalizedText.slice(0, 3) !== '<p>') {
        normalizedText = `<p>${normalizedText}`;
      }
      if (normalizedText.slice(-4) !== '</p>') {
        normalizedText = `${normalizedText}</p>`;
      }

      // trim spaces from end of text
      normalizedText = normalizedText.replace(PADDED_CLOSING_P_TAG_REGEX, '</p>');

      return normalizedText;
    })
    // insurance against mutant p tags eg <p>, </p>, or <p></p>
    .filter((block) => block instanceof Message || !MUTANT_P_TAG_REGEX.test(block))
    .reduce((acc, block, index) => {
      if (block instanceof Message) {
        acc.push(block);
        return acc;
      }
      if (EMPTY_BLOCK_REGEX.test(block)) {
        return acc;
      }
      const offset = isNumber(indexOffsets[index])
        ? indexOffsets[index]
        : indexOffsets[indexOffsets.length - 1];
      const canvasBlock = draftJsBlocks[index + offset].getData().get('canvasBlock');
      const textBlock = TextBlockV1Mixin.findOne().createMessage().set('text', block);
      if (canvasBlock && canvasBlock.has('updated_date')) {
        textBlock.set('updated_date', canvasBlock.get('updated_date'));
      }
      acc.push(textBlock);
      return acc;
    }, []);
};
