import moment from 'moment';
import { stateToHTML } from 'draft-js-export-html';
import Message from '@gdbots/pbj/Message';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';

const EMPTY_BLOCK_REGEX = /<p>(<br>)?<\/p>/;
const UPDATED_DATE_ATTR = /data-updated-date=".+?"/;
const CANVAS_BLOCK_TOKEN = 'CANVAS_BLOCK:';

/**
 * Converts an EditorState instance from the DraftJs Editor into triniti canvas blocks
 *
 * @param {*} editorState - an EditorState instance of a DraftJs Editor
 *
 * @returns {Array} an array of triniti canvas blocks
 */

export default (editorState) => {
  // fixme: this could take contentState only
  const contentState = editorState.getCurrentContent();

  const options = {
    // renderer for our custom atomic blocks
    blockRenderers: {
      atomic: (block) => `${CANVAS_BLOCK_TOKEN}${JSON.stringify(block.getData())}`,
    },
    entityStyleFn: (entity) => {
      const entityData = entity.getData();
      const entityType = entity.getType();
      if (entityType.indexOf('UPDATE') < 0) {
        return undefined;
      }
      switch (entityType) {
        case 'UPDATE':
          return {
            element: 'div',
            attributes: { // store date as string in data attr to be unpacked later ಠ_ಠ
              'data-updated-date': entityData.updatedDate.toISOString(),
            },
          };
        case 'UPDATE-LINK':
          return {
            element: 'a',
            attributes: {
              rel: entityData.rel,
              target: entityData.target,
              href: entityData.url,
              'data-updated-date': entityData.updatedDate.toISOString(),
            },
          };
        default:
          return undefined;
      }
    },
    inlineStyles: {
      HIGHLIGHT: {
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
      const blockAsJson = JSON.parse(cur.replace(new RegExp(`^${CANVAS_BLOCK_TOKEN}`), '')).canvasBlock;
      const block = ObjectSerializer.deserialize(blockAsJson);
      acc.push(block);
      return acc;
    }, []);

  // const draftJsBlocks = contentState.getBlocksAsArray();

  // for (let i = 0; i < draftJsBlocks.length; i += 1) {
  //   const block = draftJsBlocks[i];
  //   if (block.getType() === 'atomic') {
  //     const atomicBlockEntityKey = block.getEntityAt(0);
  //     if (!atomicBlockEntityKey) {
  //       break;
  //     }
  //     const atomicBlockEntity = contentState.getEntity(atomicBlockEntityKey);
  //     const { curie } = atomicBlockEntity.getData().block.schema().getCurie();
  //     // replace placeholder with actual canvasBlock
  //     blocks[blocks.indexOf(curie)] = atomicBlockEntity.getData().block;
  //   }
  // }

  const filteredNodeBlocks = blocks
    // remove "newlines" and empty p tags
    .filter((block) => !EMPTY_BLOCK_REGEX.test(block))
    // trim strings
    .map((block) => (typeof block === 'string' ? block.trim() : block));

  const lists = filteredNodeBlocks
    .filter((block) => typeof block === 'string')
    .join('')
    // match ordered and unordered list tags
    .match(/<(o|u)l>.+?<\/(o|u)l>/g);

  if (lists) {
    lists.forEach((list) => {
      const needle = list.slice(0, 4) === '<ol>' ? '<ol>' : '<ul>';
      const startPoint = filteredNodeBlocks.indexOf(needle);
      const count = (list.match(/(<\/?(o|u)l>)|(<\/?li>)/g).length / 2) + 1;
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
      let normalizedText = block.replace(new RegExp('</span><span class="highlight-text">', 'g'), '');

      // Just makes sure each text block is a valid p tag - added this after finding the pasting
      // of br tags can result in invalid html.
      if (normalizedText.slice(0, 3) !== '<p>') {
        normalizedText = `<p>${normalizedText}`;
      }
      if (normalizedText.slice(-4) !== '</p>') {
        normalizedText = `${normalizedText}</p>`;
      }

      // trim spaces from end of text
      normalizedText = normalizedText.replace(/((\s)|(&nbsp;))+<\/p>$/, '</p>');

      return normalizedText;
    })
    // insurance against mutant p tags eg <p>, </p>, or <p></p>
    .filter((block) => block instanceof Message || !/^<\/?p>(<\/p>)?$/.test(block))
    .map((block) => {
      if (block instanceof Message) {
        return block;
      }
      // anything here that is not already a block should become a text block
      if (!UPDATED_DATE_ATTR.test(block)) {
        return TextBlockV1Mixin.findOne().createMessage().set('text', block);
      }
      const dateString = block
        .match(UPDATED_DATE_ATTR)[0]
        .replace(/(data-updated-date=|")/g, '');
      const originalBlockText = block
        .replace(/data-updated-date=".+?"/g, '')
        .replace(/((\s)|(&nbsp;))+<\/div><\/p>$/, '</p>')
        .replace(/(<div.+?>|<\/div>)/g, '')
        .replace(/(<br>)+/g, '<br>')
        .replace(/<li><br><\/li>/g, '')
        .replace(/<br><\/p>/g, '</p>')
        .replace(/<p><br>/g, '<p>');

      return TextBlockV1Mixin.findOne().createMessage()
        .set('text', originalBlockText)
        .set('updated_date', moment(dateString, moment.ISO_8601).toDate());
    });
};
