import getCurrentEntityKey from 'components/blocksmith-field/utils/getCurrentEntityKey';

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
