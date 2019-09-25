import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
} from 'draft-js';
import { List } from 'immutable';
import areKeysSame from './areKeysSame';
import getEntityKey from './getEntityKey';
import normalizeKey from './normalizeKey';

/**
 * Given a canvas block and a key, creates an atomic DraftJs block (with entity) at that key
 * position. Because this replaces the block, this should usually be used on empty blocks.
 *
 * @param {ContentState} contentState - a state instance of a DraftJs Editor
 * @param {*}            canvasBlock  - a triniti canvas block
 * @param {string}       key          - a DraftJs block key
 *
 * @returns {ContentState} an EditorState instance
 */

export default (contentState, canvasBlock, key) => {
  const type = canvasBlock.schema().getId().getMessage();
  const { entityKey, newContentState } = getEntityKey(contentState, {
    type,
    mutability: 'IMMUTABLE',
    data: {
      block:
      canvasBlock,
    },
  });
  const characterMetadata = CharacterMetadata.create({
    entity: entityKey,
  });
  const draftJsBlock = new ContentBlock({
    key: normalizeKey(key),
    type: 'atomic',
    text: ' ',
    characterList: new List([characterMetadata]),
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
