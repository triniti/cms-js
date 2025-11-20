const YOUTUBE_REGEX = /.*(?:youtu.be\/|v\/|u\/\w\/|(embed|shorts|live)\/|watch\?v=)([^#&?]*).*/;
export default (value) => {
  if (!value) {
    return value;
  }

  if (YOUTUBE_REGEX.test(value)) {
    return value.match(YOUTUBE_REGEX)[2];
  }

  return value;
};
