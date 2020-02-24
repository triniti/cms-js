import { blockTypes } from '../constants';
import getSelectedBlocksList from './getSelectedBlocksList';

/**
 * Returns true if any atomic blocks are selected, false if none are.
 *
 * @param {EditorState} editorState  - a state instance of a DraftJs Editor
 *
 * @returns {boolean}
 */
export default (editorState) => {
  const selectedBlocksList = getSelectedBlocksList(editorState);
  return !!selectedBlocksList.find((b) => b.getType() === blockTypes.ATOMIC);
};
