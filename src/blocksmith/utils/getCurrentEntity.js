import getCurrentEntityKey from '@triniti/cms/blocksmith/utils/getCurrentEntityKey.js';

/**
 * Gets the entity for the current selection.
 *
 * @param {EditorState} editorState - an EditorState instance of a DraftJs Editor
 *
 * @returns {?DraftEntityInstance} the entity, or null if there is no entity
 */
export default (editorState) => {
  const contentState = editorState.getCurrentContent();
  const entityKey = getCurrentEntityKey(editorState);
  return entityKey ? contentState.getEntity(entityKey) : null;
};