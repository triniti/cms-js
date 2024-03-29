import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
  convertFromHTML,
  EditorState,
  genKey,
} from 'draft-js';
import { List, Map } from 'immutable';
import { blockTypes, inlineStyleTypes, tokens } from 'components/blocksmith-field/constants';
import isBlockAList from 'components/blocksmith-field/utils/isBlockAList';
import attachImmutableEntitiesToEmojis from 'components/blocksmith-field/utils/attachImmutableEntitiesToEmojis';

// pushed onto in various ways, then used to create the final ContentState
const masterContentBlocks = [];

const END_A_TAG_REGEX = /<\/a>/g;
const SPAN_END = '</span>';
const SPAN_END_REGEX = new RegExp(SPAN_END, 'g');
const SPAN_START = '<span class="highlight-text">';
const SPAN_START_REGEX = new RegExp(SPAN_START, 'g');
const START_A_TAG_REGEX = /<a.+?>/g;
const TAG_REGEX = /<\/?(p|strong|del|em|ul?|ol|li)>/g;
const LINK_TAG_REGEX = /<\/?(?:o|u)l>/g;

const getNumberOfSpans = (text) => (text.match(SPAN_START_REGEX) || []).length;

/**
 * Strips unwanted HTML tags (eg strong, del, etc.) from an HTML string.
 *
 * @param {string} text - An HTML string with unwanted tags.
 *
 * @returns {string} - The text with the unwanted tags removed.
 */
function stripTags(text) {
  return text.replace(TAG_REGEX, '').replace(START_A_TAG_REGEX, '').replace(END_A_TAG_REGEX, '');
}

/**
 * Applies the 'HIGHLIGHT' inline style to a ContentBlock according to the original text from
 * which said ContentBlock was created. You have to apply the style to every character, so that's
 * what happens here; the text is scanned for spans with class 'highlight-text' and if found, the
 * characters in those spans are given the style. Beware.
 *
 * @param {string}       canvasBlockText - The text from a canvasBlock of type 'text-block'.
 * @param {ContentBlock} contentBlock    - A Draft.js ContentBlock object.
 *
 * @returns {ContentBlock} - The provided ContentBlock, but now with an inline style
 *                           'HIGHLIGHT' applied where expected.
 */
function getHighlightedTextBlock(canvasBlockText, contentBlock) {
  let highlightContentBlock = contentBlock;
  let contentBlockText = highlightContentBlock.getText();
  let listArray = [];
  let existingCharacterMetadata;
  let endPoint;
  let startPoint;
  let strippedText;
  strippedText = stripTags(canvasBlockText);
  const numberOfSpans = getNumberOfSpans(strippedText);
  for (let i = 0; i < numberOfSpans; i += 1) {
    startPoint = strippedText.indexOf(SPAN_START);
    endPoint = strippedText.replace(SPAN_START, '').indexOf(SPAN_END);
    for (let j = 0; j < contentBlockText.length; j += 1) {
      existingCharacterMetadata = highlightContentBlock.getCharacterList().get(j);
      if (j >= startPoint && j < endPoint) {
        // merge character's existing style with our highlight style (eg BOLD, ITALIC)
        listArray[j] = CharacterMetadata.applyStyle(
          existingCharacterMetadata,
          inlineStyleTypes.HIGHLIGHT,
        );
      } else {
        listArray[j] = existingCharacterMetadata;
      }
    }
    highlightContentBlock = new ContentBlock({
      key: genKey(),
      type: highlightContentBlock.getType(),
      text: contentBlockText,
      characterList: new List(listArray),
    });
    contentBlockText = highlightContentBlock.getText();
    listArray = [];
    strippedText = strippedText.replace(SPAN_START, '').replace(SPAN_END, '');
  }
  return highlightContentBlock;
}

/**
 * Given an entire ul/ol tag, returns an array of each contained li.
 *
 * ex: '<ul><li>one</li><li>two</li></ul>' => ['<li>one</li>', '<li>two</li>']
 *
 * @param {string} canvasBlockText - A string representing a ul/ol tag.
 *
 * @returns {string[]} - Each individual li tag from the provided ul/ol tag string.
 */
function getListItems(canvasBlockText) {
  let formattingText = canvasBlockText.replace(LINK_TAG_REGEX, '');
  let listItem;
  const listItems = [];
  while (formattingText.length) {
    listItem = formattingText.slice(0, (formattingText.indexOf('</li>') + '</li>'.length));
    listItems.push(listItem);
    formattingText = formattingText.replace(listItem, '');
  }
  return listItems;
}

/**
 * Converts to ContentBlocks of type 'ordered-list-item' or 'unordered-list-item'. This is a
 * particularly tricky process because a single canvasBlock with ul/ol tags in it will turn
 * into one or more ContentBlocks, one for each list item within that ul/ol tag. Beware.
 *
 * @param {Object}       canvasBlock       - A triniti canvas block. This is the canvasBlock from
 *                                           which listContentBlocks and listItems were generated.
 * @param {Object}       listContentBlocks - One or more Draft.js ContentBlocks.
 * @param {string[]}     listItems         - One more more individual list items eg '<li>derp</li>'
 *
 * @returns {ContentBlocks[]} - The newly created ContentBlocks.
 */
function convertToListBlocks(canvasBlock, listContentBlocks, listItems) {
  const contentBlocks = [];
  /**
   * you have to split out each list item as if it were the only list item in its list and apply
   * styles that way. if you don't you will surely regret it. because the style will bleed into the
   * list items that come after. fortunately draft will combine them, although that behavior may
   * cause extreme pain in the future.
   */
  listContentBlocks.forEach((listContentBlock, index) => {
    const html = listContentBlock.getType() === blockTypes.ORDERED_LIST_ITEM
      ? `<ol>${listItems[index]}</ol>`
      : `<ul>${listItems[index]}</ul>`;
    const block = convertFromHTML(html).contentBlocks[0];
    const contentBlock = canvasBlock.get('text').match(SPAN_END_REGEX)
      ? getHighlightedTextBlock(listItems[index], block)
      : block;
    contentBlocks.push(new ContentBlock({
      characterList: contentBlock.getCharacterList(),
      data: new Map({ canvasBlock }),
      key: genKey(),
      text: contentBlock.getText(),
      type: contentBlock.getType(),
    }));
  });
  return contentBlocks;
}

/**
 * Converts a triniti canvasBlock (text-block) into Draft.js contentBlock. Depending on the contents
 * of the canvasBlock, multiple kinds of contentBlocks can be returned. Their types may be
 * 'unstyled', 'unordered-list-item', or 'ordered-list-item'. They may have additional entities
 * (eg 'UPDATE') or inline styles (eg 'HIGHLIGHT') applied to them.
 *
 * @param {Object}       canvasBlock  - A triniti canvas block (has triniti:canvas:mixin:block).
 *
 * @returns {ContentBlock[]} - The newly created ContentBlocks.
 */
function convertTextBlock(canvasBlock) {
  const canvasBlockText = canvasBlock.get('text');
  let convertedListBlocks = [];
  const contentBlocks = [];
  const listContentBlocks = []; // of type 'ordered-list-item' or 'unordered-list-item'
  (convertFromHTML(canvasBlockText).contentBlocks || []).forEach((block) => {
    if (isBlockAList(block)) {
      listContentBlocks.push(block);
    } else {
      const contentBlock = canvasBlockText.match(SPAN_END_REGEX)
        ? getHighlightedTextBlock(canvasBlockText, block)
        : block;
      contentBlocks.push(new ContentBlock({
        characterList: contentBlock.getCharacterList(),
        data: new Map({ canvasBlock }),
        key: genKey(),
        text: contentBlock.getText() === tokens.EMPTY_BLOCK_TOKEN ? '' : contentBlock.getText(),
        type: contentBlock.getType(),
      }));
    }
  });
  if (listContentBlocks.length) {
    convertedListBlocks = convertToListBlocks(
      canvasBlock,
      listContentBlocks,
      getListItems(canvasBlockText),
    );
    if (convertedListBlocks.length) {
      contentBlocks.push(...convertedListBlocks);
    }
  }
  return contentBlocks;
}

/**
 * Converts triniti canvas blocks into an EditorState instance for the Draft.js Editor.
 *
 * @link https://draftjs.org/docs/advanced-topics-decorators#compositedecorator
 *
 * @param {Array}              canvasBlocks - An array of triniti canvas blocks (each
 *                                            has triniti:canvas:mixin:block).
 * @param {CompositeDecorator} decorator    - A Draft.js CompositeDecorator. See link.
 *
 * @returns {EditorState} a Draft.js EditorState instance to be used in Blocksmith.
 */
export default function convertToEditorState (canvasBlocks, decorator = null) {
  const editorState = EditorState.createEmpty();
  const contentState = editorState.getCurrentContent();
  let convertedTextBlocks = [];
  canvasBlocks.forEach((canvasBlock) => {
    switch (canvasBlock.schema().getQName().getMessage()) {
      case 'text-block':
        convertedTextBlocks = convertTextBlock(canvasBlock);
        if (convertedTextBlocks.length) {
          masterContentBlocks.push(...convertedTextBlocks);
        }
        break;
      default:
        masterContentBlocks.push(new ContentBlock({
          characterList: new List([]),
          data: new Map({ canvasBlock }),
          key: genKey(),
          text: ' ',
          type: blockTypes.ATOMIC,
        }));
        break;
    }
  });
  let state;
  if (masterContentBlocks.length) {
    state = ContentState.createFromBlockArray(
      masterContentBlocks,
      contentState.getEntityMap(),
    );
    state = attachImmutableEntitiesToEmojis(state);
    state = EditorState.createWithContent(state, decorator);
  } else {
    state = EditorState.createEmpty(decorator);
  }
  masterContentBlocks.length = 0;
  return state;
}
