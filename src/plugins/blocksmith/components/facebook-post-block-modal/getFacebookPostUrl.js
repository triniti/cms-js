// supports list of valid Post Urls - https://developers.facebook.com/docs/plugins/oembed
const getFacebookPostUrl = (str) => {
  try {
    const regex = new RegExp('(?:(?:https?:)?\\/\\/)?(?:www\\.)?facebook\\.com\\/([^\\/]+\\/photo(\\.php|s|)(\\/|)|photo(\\.php|s|)(\\/|)|permalink\\.php(\\/|)|media\\/set(\\/|)|questions|notes|[^\\/]+\\/(activity|posts))[\\/?](set=|fbid=|[^\\/]+\\/[^\\/]+\\/|(?=.*\\bstory_fbid=\\b)(?=.*\\bid=\\b).+)?(?:[a-z0-9\\.]+\\/)?([0-9]+)\\/?(?:\\?.[^\\s][^"]*)?');
    const postUrlMatches = decodeURIComponent(str).match(regex);
    return postUrlMatches ? postUrlMatches[0] : null;
  } catch (e) {
    // possible URIError ("malformed URI sequence") exception when used wrongly
    console.error('getFacebookPostUrl: ', e);
    return null;
  }
};

export default getFacebookPostUrl;
