import getLines from './getLines';

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
  return editorState.getSelection().getAnchorOffset() + 1 > offsetAtStartOfLastLine;
};
