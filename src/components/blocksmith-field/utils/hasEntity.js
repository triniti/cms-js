import getCurrentEntity from 'components/blocksmith-field/utils/getCurrentEntity';

/**
 * Checks if the current entity is of a certain type
 *
 * @param {*} editorState     - an EditorState instance of a DraftJs Editor
 * @param {string} entityType - an entity type (eg 'LINK')
 *
 * @returns {boolean}
 */
export default (editorState, entityType) => {
  const entity = getCurrentEntity(editorState);
  return entity && entity.getType() === entityType;
};
