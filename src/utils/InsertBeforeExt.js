import getExt from './getExt.js';

/**
 * @param {String} fileName - A file name including extension.
 * @param {String} str      - A String to insert before the extension.
 *
 * Ex: A key of 'thylacine.mp4' and a str of '-daydream' returns 'thylacine-daydream.mp4'
 *
 * @returns {String}
 */
export default (fileName, str) => {
  const ext = getExt(fileName);
  return fileName.replace(new RegExp(`.${ext}$`), `${str}.${ext}`);
};
