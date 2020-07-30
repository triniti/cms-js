import getExt from './getExt';

/**
 * @param {String} key - A file name including extension.
 * @param {String} str - A String to insert before the extension.
 *
 * Ex: A key of 'thylacine.mp4' and a str of '-daydream' returns 'thylacine-daydream.mp4'
 *
 * @returns {String}
 */
export default (key, str) => {
  const ext = getExt(key);
  return key.replace(new RegExp(`.${ext}$`), `${str}.${ext}`);
};
