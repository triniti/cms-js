/**
 * @param {String} fileName - A file name including extension.
 *
 * Returns a file name's extension, or undefined if there is none.
 * Example: a key of 'palimpsest.mp4' returns 'mp4'
 *
 * @returns {(String|undefined)}
 */
export default (fileName) => {
  const split = fileName.split('.');
  return split.length > 1 ? split.pop() || undefined : undefined;
};
