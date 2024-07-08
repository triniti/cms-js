const HREF_ATTR_MATCH = /href=".+?"/;
const LINK_TAG_MATCH = /<a.+?\/a>/g;
const TWITTER_EMBED_REGEX = /^<blockquote.+https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9\\.]+(\n|.)+<\/script>[\s\r\n]*$/m;
const TWITTER_TWEET_REGEX = /https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9\\.]+/;
const URL_MATCH = /(?:(?:^href=")|(?:"$))/g;

export default (embedCode) => {
  if (!TWITTER_EMBED_REGEX.test(embedCode)) {
    return {
      tweetText: null,
      screenName: null,
      tweetId: null,
    };
  }

  let decodedEmbedCode = embedCode;
  const linkMatches = embedCode.match(LINK_TAG_MATCH);
  if (linkMatches) {
    linkMatches.forEach((match) => {
      const href = match.match(HREF_ATTR_MATCH);
      if (href) {
        const url = href[0].replace(URL_MATCH, '');
        decodedEmbedCode = decodedEmbedCode.replace(url, decodeURIComponent(url));
      }
    });
  }

  const tweetText = decodedEmbedCode.replace(/<script.+<\/script>/, '')
    .replace(/<blockquote.+?>/, '')
    .replace('</blockquote>', '')
    .replace(/(?:\n|(?:\s$))/g, '')
    .trim();
  decodedEmbedCode = decodedEmbedCode.match(TWITTER_TWEET_REGEX)[0];
  const screenName = decodedEmbedCode.split('/')[3];
  const tweetId = decodedEmbedCode.split('/')[5];

  return {
    tweetText,
    screenName,
    tweetId,
  };
};