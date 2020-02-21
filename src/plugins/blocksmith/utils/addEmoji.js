// modified from https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/addEmoji.js

import { Modifier, EditorState } from 'draft-js';
import { entityTypes, mutabilityTypes } from '../constants';
import selectBlock, { selectionTypes } from './selectBlock';

/**
 * @param {EditorState}             editorState
 * @param {string}                  emoji
 * @param {(object|number|string)?} blockIdentifier - if supplied, adds emoji at end of that block
 *
 * @returns {boolean}
 */
export default (editorState, emoji, blockIdentifier = null) => {
  let newEditorState = editorState;
  let originalSelectionState;
  if (blockIdentifier) {
    originalSelectionState = newEditorState.getSelection(); // save selection for later
    newEditorState = selectBlock(newEditorState, blockIdentifier, selectionTypes.END);
  }
  const contentState = newEditorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(entityTypes.EMOJI, mutabilityTypes.IMMUTABLE, { emoji });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const currentSelectionState = newEditorState.getSelection();

  // in case text is selected it is removed and then the emoji is added
  const afterRemovalContentState = Modifier.removeRange(
    contentState,
    currentSelectionState,
    'backward',
  );

  // deciding on the position to insert emoji
  const targetSelection = afterRemovalContentState.getSelectionAfter();

  const emojiAddedContent = Modifier.insertText(
    afterRemovalContentState,
    targetSelection,
    emoji,
    null,
    entityKey,
  );

  newEditorState = EditorState.push(
    newEditorState,
    emojiAddedContent,
    'add-emoji',
  );

  if (originalSelectionState) {
    // return selection to what it was before insertion
    newEditorState = EditorState.acceptSelection(newEditorState, originalSelectionState);
    return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
  }

  return EditorState.forceSelection(newEditorState, emojiAddedContent.getSelectionAfter());
};
