// modified from https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/attachImmutableEntitiesToEmojis.js

import { Modifier, SelectionState } from 'draft-js';
import { entityTypes, mutabilityTypes } from '../constants';
import applyToBlockText from './applyToBlockText';

let emojiRegex = /$^/; // matches nothing (just so tests dont die)
// tape does not understand the module resolver, regular import breaks all tests
import('config/emojis').then(({ entityEmojis }) => { // eslint-disable-line import/no-unresolved
  emojiRegex = new RegExp(`((${Object.values(entityEmojis).join(')|(')}))`, 'g');
});

/**
 * Attaches Immutable DraftJS Entities to the Emoji text.
 *
 * This is necessary as some emojis consist of 2+ characters (unicode). By making them
 * immutable the whole Emoji is removed when hitting backspace.
 *
 * @param {ContentState} contentState
 *
 * @returns {ContentState}
 */
export default (contentState) => {
  const blocks = contentState.getBlockMap();
  let newContentState = contentState;

  blocks.forEach((block) => {
    const plainText = block.getText();

    const addEntityToEmoji = (start, end) => {
      const emoji = plainText.substring(start, end);
      const existingEntityKey = block.getEntityAt(start);
      if (existingEntityKey) {
        // avoid manipulation in case the emoji already has an entity
        const entity = newContentState.getEntity(existingEntityKey);
        if (entity && entity.get('type') === entityTypes.EMOJI) {
          return;
        }
      }

      const selection = SelectionState.createEmpty(block.getKey())
        .set('anchorOffset', start)
        .set('focusOffset', end);
      newContentState = newContentState.createEntity(
        entityTypes.EMOJI,
        mutabilityTypes.IMMUTABLE,
        { emoji },
      );
      const entityKey = newContentState.getLastCreatedEntityKey();

      newContentState = Modifier.replaceText(
        newContentState,
        selection,
        emoji,
        null,
        entityKey,
      );
    };

    applyToBlockText(emojiRegex, block, addEntityToEmoji);
  });

  return newContentState;
};
