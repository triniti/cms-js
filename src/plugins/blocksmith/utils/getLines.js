import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

/**
 * Calculates and returns an array of the individual lines of a text block. Useful for
 * some keyboard navigation behavior.
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {Array}
 */
export default (editorState) => {
  let moreThanOneLine = false;
  let height;
  let testSpanHeight;
  let line = '';
  let startPoint = 0;
  const endWordIndices = [];
  const lines = [];
  const anchorKey = editorState.getSelection().getAnchorKey();
  const offsetKey = DraftOffsetKey.encode(anchorKey, 0, 0);
  const currentBlockNode = document.querySelector(`[data-offset-key="${offsetKey}"] span span`);
  const width = currentBlockNode.getBoundingClientRect().width;
  const testSpan = document.createElement('span');
  // declared in blocksmith styles, allows us to calculate lines based on style
  testSpan.classList.add('line-length-tester');
  testSpan.setAttribute('style', `width: ${width}px`);
  document.body.appendChild(testSpan);
  const text = editorState.getCurrentContent().getBlockForKey(anchorKey).getText();
  const words = text.split(' ');
  testSpan.innerHTML = words[0];
  height = testSpan.getBoundingClientRect().height;
  for (let i = 1; i < words.length; i += 1) {
    testSpan.innerHTML += ` ${words[i]}`;
    testSpanHeight = testSpan.getBoundingClientRect().height;
    if (testSpanHeight > height) {
      moreThanOneLine = true;
      endWordIndices.push(i);
      height = testSpanHeight;
    }
  }
  endWordIndices.push(words.length - 1); // final word index
  if (moreThanOneLine) {
    for (let i = 0; i < endWordIndices.length; i += 1) {
      for (let j = startPoint; j < endWordIndices[i]; j += 1) {
        line += `${words[j]} `;
      }
      lines.push(line);
      line = '';
      startPoint = endWordIndices[i];
    }
    lines[lines.length - 1] += words[words.length - 1]; // final word
  }
  document.body.removeChild(testSpan);

  return lines;
};
