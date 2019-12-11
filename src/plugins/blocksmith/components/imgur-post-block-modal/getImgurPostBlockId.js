const getImgurPostBlockId = (str) => {
  const IMGUR_POST_BLOCK_ID_REGEX = /data-id="(a|gallery)?\/?\w+/g;
  const IMGUR_POST_BLOCK_URL = /\/\/imgur\.com\/?(|a|gallery)+\/\w+/g;
  const hasDataAttr = IMGUR_POST_BLOCK_ID_REGEX.test(str);

  if (hasDataAttr) {
    return (str && str.match(IMGUR_POST_BLOCK_ID_REGEX))
      ? str.match(IMGUR_POST_BLOCK_ID_REGEX)[0].split('"')[1]
      : str;
  }

  const result = (str && str.match(IMGUR_POST_BLOCK_URL))
    ? str.match(IMGUR_POST_BLOCK_URL)[0]
      .split('/')
      .filter((s) => {
        if (s === '' || s === 'imgur.com') {
          return false;
        }

        return true;
      })
    : '';

  if (result.length === 2) {
    return `a/${result[1]}`;
  }

  return result ? result[0] : '';
};

export default getImgurPostBlockId;
