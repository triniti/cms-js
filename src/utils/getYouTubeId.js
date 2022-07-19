const YOUTUBE_REGEX = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
export default (value) => {
  if (YOUTUBE_REGEX.test(value)) {
    return value.match(YOUTUBE_REGEX)[1];
  }

  return value;
};
