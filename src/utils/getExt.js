/**
 * @param {String} key - A file name including extension.
 *
 * Returns a file name's extension, or undefined if there is none.
 * Example: a key of 'palimpsest.mp4' returns 'mp4'
 *
 * @returns {(String|undefined)}
 */
export default (key) => {
  const split = key.split('.');
  if (split.length > 1) {
    return split.pop() || undefined;
  }
  return undefined;
};
