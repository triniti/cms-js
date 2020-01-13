const getImgurPostBlockId = (str) => {
  const IMGUR_POST_BLOCK_HAS_TYPE = /\/(a|gallery)+\//;
  const IMGUR_POST_BLOCK_EMBED_REGEX = /data-id="(a|gallery)?\/?\w+/;
  const IMGUR_POST_BLOCK_URL_REGEX = /http?s:\/\/imgur\.com\/(a|gallery)?(\w+)(\/?)\w+(\/?)/;
  const isEmbed = IMGUR_POST_BLOCK_EMBED_REGEX.test(str);
  const isUrl = IMGUR_POST_BLOCK_URL_REGEX.test(str);
  const hasType = IMGUR_POST_BLOCK_HAS_TYPE.test(str);

  if (isEmbed) {
    return str
      .match(IMGUR_POST_BLOCK_EMBED_REGEX)[0]
      .split('"')[1];
  }

  if (isUrl) {
    if (hasType) {
      const url = str
        .match(IMGUR_POST_BLOCK_URL_REGEX)[0]
        .split('/')
        .filter((s) => (!((!s || s === 'https:' || s === 'imgur.com'))));

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
