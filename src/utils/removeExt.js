import getExt from './getExt';

/**
 * @param {String} key - A file name including extension.
 *
 * Returns the file name without extension.
 * Ex: A key of 'buffalo.mp4' returns 'buffalo'
 *
 * @returns {String}
 */
export default (key) => key.replace(new RegExp(`.${getExt(key)}$`), '');
