export const YOURTUBE_PLAYLIST_URL_REGEX = /list=[a-zA-Z0-9_-]+/g;
export const YOUTUBE_PLAYLIST_ID_REGEX = /[a-zA-Z0-9_-]/g;

const getYoutubePlayId = (str) => {
  const isEmbed = YOURTUBE_PLAYLIST_URL_REGEX.test(str);

  if (isEmbed) {
    const playlistId = str.match(YOURTUBE_PLAYLIST_URL_REGEX)[0].split('=')[1];
    return playlistId;
  }

  return str;
};

export default getYoutubePlayId;
