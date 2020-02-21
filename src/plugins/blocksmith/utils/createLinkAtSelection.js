import {
  EditorState,
  RichUtils,
} from 'draft-js';
import { entityTypes, mutabilityTypes } from '../constants';
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

  const updatedEntityState = getEntityKey(editorState.getCurrentContent(), {
    type: entityTypes.LINK,
    mutability: mutabilityTypes.MUTABLE,
    data: { rel, target, url },
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
