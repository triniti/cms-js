import getExt from './getExt';

/**
 * @param {String} fileName - A file name including extension.
 *
 * Returns the file name without extension.
 * Ex: A key of 'buffalo.mp4' returns 'buffalo'
 *
 * @returns {String}
 */
export default (fileName) => fileName.replace(new RegExp(`.${getExt(fileName)}$`), '');
