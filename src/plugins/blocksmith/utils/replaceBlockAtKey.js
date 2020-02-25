import { ContentBlock, ContentState } from 'draft-js';
import { List, Map } from 'immutable';
import { blockTypes } from '../constants';
import areKeysSame from './areKeysSame';
import normalizeKey from './normalizeKey';

/**
 * Given a canvas block and a key, creates a DraftJs block (with data) at that key
 * position. Because this replaces the block, this should usually be used on empty blocks.
 *
 * @param {ContentState} contentState - a state instance of a DraftJs Editor
 * @param {*}            canvasBlock  - a triniti canvas block
 * @param {string}       key          - a DraftJs block key
 *
 * @returns {ContentState} an EditorState instance
 */
export default (contentState, canvasBlock, key) => {
  const newContentState = contentState;
  const draftJsBlock = new ContentBlock({
    characterList: new List([]),
    data: new Map({ canvasBlock }),
    key: normalizeKey(key),
    text: ' ',
    type: blockTypes.ATOMIC,
  });
  const blocksAsArray = newContentState.getBlocksAsArray();
  const newBlocksAsArray = blocksAsArray.map((block) => {
    if (areKeysSame(block.getKey(), key)) {
      return draftJsBlock;
    }
    return block;
  });
  return ContentState.createFromBlockArray(
    newBlocksAsArray,
    newContentState.getEntityMap(),
  );
};
