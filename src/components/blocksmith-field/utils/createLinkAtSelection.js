import { EditorState, RichUtils } from 'draft-js';
import { entityTypes, mutabilityTypes } from '@triniti/cms/components/blocksmith-field/constants';

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
    return editorState;
  }

  const contentState = editorState.getCurrentContent().createEntity(
    entityTypes.LINK,
    mutabilityTypes.MUTABLE,
    { rel, target, url },
  );
  const entityKey = contentState.getLastCreatedEntityKey();
  let newEditorState = RichUtils.toggleLink(
    editorState,
    selectionState,
    entityKey,
  );

  newEditorState = EditorState.acceptSelection(newEditorState, newEditorState.getSelection());
  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};
