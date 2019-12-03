export const SPOTIFY_TYPE_REGEX = /(show|episode|album|track|playlist)+/;

const getSpotifyMediaId = (str) => {
  const regex = /([0-9])\w+/g;
  const isValid = regex.test(str);
  const mediaId = str.match(regex);

  return isValid ? mediaId[0] : null;
};


export default getSpotifyMediaId;
