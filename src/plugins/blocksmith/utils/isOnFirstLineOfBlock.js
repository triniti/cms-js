import getLines from './getLines';

/**
 * Checks if the text indicator is on the first line of a text block.
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {boolean}
 */
export default (editorState) => {
  const lines = getLines(editorState);
  return lines.length <= 1 || editorState.getSelection().getAnchorOffset() < lines[0].length;
};
