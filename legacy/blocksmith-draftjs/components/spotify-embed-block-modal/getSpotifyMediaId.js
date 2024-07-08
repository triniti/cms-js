export const SPOTIFY_STRIP_MEDIA_ID_REGEX = /([0-9])\w+/;
export const SPOTIFY_STRIP_TYPE_REGEX = /(show|episode|artist|album|track|playlist)+/;
export const SPOTIFY_TRACK_REGEX = /spotify:track:[a-zA-Z0-9-]+/;
export const SPOTIFY_URL_REGEX = /https?:\/\/open\.spotify\.com\/(show|episode|artist|album|track|playlist)\/[a-zA-Z0-9-]+/;
export const SPOTIFY_IFRAME_REGEX = /https?:\/\/open\.spotify\.com\/(embed|embed-podcast)\/(show|episode|artist|album|track|playlist)\/[a-zA-Z0-9-]+/;

const getSpotifyMediaId = (str) => {
  if (
    SPOTIFY_TRACK_REGEX.test(str)
    || SPOTIFY_URL_REGEX.test(str)
    || SPOTIFY_IFRAME_REGEX.test(str)) {
    if (str.match(SPOTIFY_STRIP_MEDIA_ID_REGEX).length) {
      const id = str.match(SPOTIFY_STRIP_MEDIA_ID_REGEX)[0];
      const type = str.match(SPOTIFY_STRIP_TYPE_REGEX)[0];
      return { id, type };
    }
  }

  return { id: '', type: '' };
};

export default getSpotifyMediaId;