/**
 * Returns the total word count ( integer ) considering only all text blocks.
 *
 * @link https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-counter-plugin/src/WordCounter/index.js
 *
 * @param editorState
 *
 * @returns {Number}
 */

export default (editorState) => {
  if (!editorState) {
    return 0;
  }
  const plainText = editorState.getCurrentContent().getPlainText('');
  const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
  const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
  const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace
  return wordArray ? wordArray.length : 0;
};
