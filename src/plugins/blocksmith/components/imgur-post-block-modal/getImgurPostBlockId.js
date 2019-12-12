const getImgurPostBlockId = (str) => {
  const IMGUR_POST_BLOCK_HAS_TYPE = /\/(a|gallery)+\//g;
  const IMGUR_POST_BLOCK_HAS_EMBED_REGEX = /data-id="(a|gallery)?\/?\w+/g;
  const IMGUR_POST_BLOCK_URL_REGEX = /http?s:\/\/imgur\.com\/(a|gallery)?(\w+)(\/?)\w+(\/?)/g;

  // handle embed
  if (IMGUR_POST_BLOCK_HAS_EMBED_REGEX.test(str)) {
    return str
      .match(IMGUR_POST_BLOCK_HAS_EMBED_REGEX)[0]
      .split('"')[1];
  }

  // handle url
  if (IMGUR_POST_BLOCK_URL_REGEX.test(str)) {
    if (IMGUR_POST_BLOCK_HAS_TYPE.test(str)) {
      const url = str
        .match(IMGUR_POST_BLOCK_URL_REGEX)[0]
        .split('/')
        .filter((s) => {
          if (!s || s === 'https:' || s === 'imgur.com') {
            return false;
          }
          return true;
        });

      return `a/${url[1]}`;
    }

    const url = str
      .match(IMGUR_POST_BLOCK_URL_REGEX)[0]
      .split('/');

    return url[url.length - 1];
  }

  return str;
};

export default getImgurPostBlockId;
