// fixme: this needs to handle more youtube url styles (including shorts)
const YOUTUBE_REGEX = /.*(?:youtu.be\/|v\/|u\/\w\/|(embed|shorts)\/|watch\?v=)([^#&?]*).*/;
export default (value) => {
  if (YOUTUBE_REGEX.test(value)) {
    return value.match(YOUTUBE_REGEX)[2];
  }

  return value;
};
