export const YOUTUBE_PLAYLIST_ID_QUERY_STRING_REGEX = /list=[a-zA-Z0-9_-]+/;
export const YOUTUBE_VIDEO_ID_QUERY_STRING_REGEX = /v=[a-zA-Z0-9_-]+/;
export const ID_REGEX = /[a-zA-Z0-9_-]/;

const getYoutubePlayId = (str) => {
  if (/https:\/\/www\.youtube\.com\/(watch|playlist|embed\/videoseries).*list=/.test(str)) {
    return {
      isValid: true,
      playlistId: str.match(YOUTUBE_PLAYLIST_ID_QUERY_STRING_REGEX)[0].replace('list=', ''),
      videoId: YOUTUBE_VIDEO_ID_QUERY_STRING_REGEX.test(str)
        ? str.match(YOUTUBE_VIDEO_ID_QUERY_STRING_REGEX)[0].replace('v=', '')
        : null,
    };
  }

  if (ID_REGEX.test(str)) {
    return {
      isValid: true,
      playlistId: str,
      videoId: null,
    };
  }

  return {
    isValid: false,
  };
};

export default getYoutubePlayId;
