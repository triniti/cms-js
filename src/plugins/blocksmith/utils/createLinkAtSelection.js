import {
  EditorState,
  RichUtils,
} from 'draft-js';
import getEntityKey from './getEntityKey';

/**
 * Turns selected text into a link
 *
 * @link https://draftjs.org/docs/api-reference-rich-utils#togglelink
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 * @param {string}      target      - the link target (ie '_blank')
 * @param {string}      url         - the url aka href value
 *
 * @returns {EditorState} an EditorState instance
 */

export default (editorState, target, url) => {
  const rel = target === '_blank' ? 'noopener noreferrer' : null;
  const selectionState = editorState.getSelection();
  if (selectionState.getAnchorKey() !== selectionState.getFocusKey()) {
    throw new Error('Multi-block links currently not supported');
  }
  let existingEntity;
  const contentBlock = editorState.getCurrentContent()
    .getBlockForKey(selectionState.getAnchorKey());
  for (let i = selectionState.getStartOffset(); i < selectionState.getEndOffset(); i += 1) {
    if (contentBlock.getEntityAt(i)) {
      existingEntity = editorState.getCurrentContent().getEntity(contentBlock.getEntityAt(i));
      break;
    }
  }

  let newEntityType = 'LINK';
  let newEntityData = { rel, target, url };
  if (existingEntity) {
    newEntityData = {
      ...existingEntity.getData(),
      ...newEntityData,
    };
    if (existingEntity.getType().indexOf('LINK') < 0) {
      newEntityType = `${existingEntity.getType()}-LINK`;
    }
  }

  const updatedEntityState = getEntityKey(editorState.getCurrentContent(), {
    type: newEntityType,
    mutability: 'MUTABLE',
    data: newEntityData,
  });
  const newEntityKey = updatedEntityState.entityKey;
  let newEditorState = RichUtils.toggleLink(
    editorState,
    selectionState,
    newEntityKey,
  );

  newEditorState = EditorState.acceptSelection(newEditorState, newEditorState.getSelection());
  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};
