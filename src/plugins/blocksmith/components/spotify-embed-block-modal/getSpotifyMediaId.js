export const SPOTIFY_STRIP_TYPE_REGEX = /(show|episode|album|track|playlist)+/g;
export const SPOTIFY_STRIP_MEDIA_ID_REGEX = /([0-9])\w+/g;
export const SPOTIFY_TRACK_REGEX = /spotify:track:[a-zA-Z0-9-]+/g;
export const SPOTIFY_URL_REGEX = /http?s:\/\/open\.spotify\.com\/(show|episode|album|track|playlist)\/[a-zA-Z0-9-]+/g;
export const SPOTIFY_IFRAME_REGEX = /http?s:\/\/open\.spotify\.com\/(embed|embed-podcast)\/(show|episode|album|track|playlist)\/[a-zA-Z0-9-]+/g;

const getSpotifyMediaId = (str) => {
  if (
    SPOTIFY_TRACK_REGEX.test(str)
    || SPOTIFY_URL_REGEX.test(str)
    || SPOTIFY_IFRAME_REGEX.test(str)) {
    let id = str.match(SPOTIFY_STRIP_MEDIA_ID_REGEX);
    id = id ? id[0] : '';

    let type = str.match(SPOTIFY_STRIP_TYPE_REGEX);
    type = type ? type[0] : '';

    return { id, type, valid: true };
  }

  return { id: '', type: '', valid: false };
};

export default getSpotifyMediaId;
