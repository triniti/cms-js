/**
 * Converts bytes to a human readable format.
 *
 * @param {number|string} bytes
 *
 * @returns {string}
 */
export default (bytes) => {
  if (bytes > 1024 && bytes < 1000000) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  } else if (bytes >= 1000000) {
    return `${(bytes / 1048576).toFixed(0)} MB`;
  }

  return `${bytes} bytes`;
};
