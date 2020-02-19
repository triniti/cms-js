import { genKey, ContentBlock, ContentState } from 'draft-js';
import { List, Map } from 'immutable';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';
import getListBlocks from './getListBlocks';

/**
 * Deletes a list block, which is to say deletes the set of adjacent ContentBlocks
 * of the same list type.
 *
 * @param {ContentState} contentState - a ContentState instance of a DraftJs Editor
 * @param {(object|number|string)} id - a block, a block index, or a block key
 *
 * @returns {ContentState} a ContentState instance
 */

export default (contentState, id) => {
  const listBlocks = getListBlocks(contentState, id);
  const newContentState = ContentState.createFromBlockArray(
    contentState.getBlocksAsArray()
      .filter((blockFromArray) => !listBlocks.includes(blockFromArray)),
    contentState.getEntityMap(),
  );

  if (newContentState.getBlocksAsArray().length) {
    return newContentState;
  }

  // having no blocks will crash editor, add empty text block
  return ContentState.createFromBlockArray(
    [
      new ContentBlock({
        characterList: new List([]),
        data: new Map({ canvasBlock: TextBlockV1Mixin.findOne().createMessage() }),
        key: genKey(),
        text: '',
        type: 'unstyled',
      }),
    ],
    newContentState.getEntityMap(),
  );
};
