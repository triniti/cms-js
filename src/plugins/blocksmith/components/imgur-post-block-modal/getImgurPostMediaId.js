const getImgurPostMediaId = (str) => {
  const IMGUR_POST_MEDIA_ID_REGEX = /\/\/imgur\.com\/(a\/|gallery\/)?\w+/g;

  const isValid = IMGUR_POST_MEDIA_ID_REGEX.test(str);
  const mediaId = str.match(IMGUR_POST_MEDIA_ID_REGEX) ? str.match(IMGUR_POST_MEDIA_ID_REGEX)[0].split('/') : '';
  const lastIdx = mediaId.length - 1;

  return isValid ? mediaId[lastIdx] : '';
};

export default getImgurPostMediaId;
