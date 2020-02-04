import getLines from './getLines';

export default (editorState, testClass) => {
  const lines = getLines(editorState, testClass);
  return lines.length <= 1 || editorState.getSelection().getAnchorOffset() < lines[0].length;
};
