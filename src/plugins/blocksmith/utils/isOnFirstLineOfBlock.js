import getLines from './getLines';

export default (editorState) => {
  const lines = getLines(editorState);
  return lines.length <= 1 || editorState.getSelection().getAnchorOffset() < lines[0].length;
};
