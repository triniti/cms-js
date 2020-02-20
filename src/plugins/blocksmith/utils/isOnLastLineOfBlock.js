import getLines from './getLines';

/**
 * Checks if the text indicator is on the final line of a text block.
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {boolean}
 */
export default (editorState) => {
  const lines = getLines(editorState);
  if (lines.length <= 1) {
    return true;
  }
  const offsetAtStartOfLastLine = lines.reduce((acc, cur, idx, src) => {
    if (idx + 1 === src.length) {
      return acc;
    }
    return acc + cur.length;
  }, 0);
  return editorState.getSelection().getAnchorOffset() > offsetAtStartOfLastLine;
};
