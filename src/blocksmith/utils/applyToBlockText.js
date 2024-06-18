// adapted from https://raw.githubusercontent.com/draft-js-plugins/find-with-regex/master/src/index.js

const findWithRegex = (regex, contentBlock, callback) => {
  // Get the text from the contentBlock
  const text = contentBlock.getText();
  let matchArr;
  let start;
  // Go through all matches in the text and return the indizes to the callback
  while ((matchArr = regex.exec(text)) !== null) {
    if (matchArr.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

export default findWithRegex;
