import getLines from './getLines';

export default (editorState, testClass) => {
  const lines = getLines(editorState, testClass);
  let offsetAtStartOfLastLine = 0;
  for (let i = 0; i < lines.length - 1; i += 1) {
    offsetAtStartOfLastLine += lines[i].length;
  }
  return lines.length <= 1 || editorState.getSelection().getAnchorOffset() + 1 > offsetAtStartOfLastLine;
};
