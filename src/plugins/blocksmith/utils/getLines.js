import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

/**
 * Returns the number of lines for a string dictated by line breaks only. Necessary because the
 * method below that uses an actual node with styling does not account for line breaks.
 *
 * @param {string} txt - a string to check for line breaks
 *
 * @returns {Array}
 */
const getLinesBrokenByLineBreaks = (txt) => {
  let text = txt;
  let matchIndex;
  const lines = [];

  while (/\r|\n/.test(text)) {
    matchIndex = text.match(/\r|\n/).index;
    lines.push(text.slice(0, matchIndex));
    text = text.slice(matchIndex + 1, text.length);
  }

  lines.push(text);
  return lines;
};

/**
 * Calculates the number of lines for a given string using an actual dom node and what happens to
 * it as text is appended.
 *
 * @param {number} node - a node to fill with text to find the wrapped lines
 * @param {string} text - a string to check for wrapped text
 *
 * @returns {Array}
 */
const getLinesBrokenByStyle = (node, text) => {
  const testNode = node;
  let height;
  let testSpanHeight;
  const endWordIndices = [];
  let startPoint = 0;
  let line = '';
  const lines = [];
  const words = text.split(' ');

  testNode.innerHTML = words[0];
  height = testNode.getBoundingClientRect().height;
  for (let i = 1; i < words.length; i += 1) {
    testNode.innerHTML += ` ${words[i]}`;
    testSpanHeight = testNode.getBoundingClientRect().height;
    if (testSpanHeight > height) {
      endWordIndices.push(i);
      height = testSpanHeight;
    }
  }
  endWordIndices.push(words.length - 1); // final word index

  if (endWordIndices.length > 1) {
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

  return lines;
};

/**
 * Calculates and returns an array of the individual lines of a text block. Useful for
 * some keyboard navigation behavior.
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {Array}
 */
export default (editorState) => {
  const anchorKey = editorState.getSelection().getAnchorKey();
  const offsetKey = DraftOffsetKey.encode(anchorKey, 0, 0);
  const currentBlockNode = document.querySelector(`[data-offset-key="${offsetKey}"] span div span span`);

  const testNode = currentBlockNode.cloneNode();
  testNode.style.opacity = 0;
  testNode.style.position = 'fixed';
  testNode.style.width = `${currentBlockNode.getBoundingClientRect().width}px`;
  currentBlockNode.parentNode.insertBefore(testNode, currentBlockNode);

  const text = editorState.getCurrentContent().getBlockForKey(anchorKey).getText();
  const lines = getLinesBrokenByLineBreaks(text).reduce((acc, cur) => {
    const styleLines = getLinesBrokenByStyle(testNode, cur);
    testNode.innerHTML = '';
    if (!styleLines.length) {
      acc.push(cur);
    } else {
      acc.push(...styleLines);
    }
    return acc;
  }, []);

  currentBlockNode.parentNode.removeChild(testNode);

  return lines;
};
