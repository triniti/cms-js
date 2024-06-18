export const YOUTUBE_PLAYLIST_ID_QUERY_STRING_REGEX = /list=[a-zA-Z0-9_-]+/;
export const ID_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * @param {string} str
 *
 * Strips the playlist id from a playlist id, url, or embed code.
 *
 * @returns {Object}
 */
export default (str) => {
  if (/https:\/\/www\.youtube\.com\/(watch|playlist|embed\/videoseries).*list=/.test(str)) {
    return str.match(YOUTUBE_PLAYLIST_ID_QUERY_STRING_REGEX)[0].replace('list=', '');
  }
};
