export const TIKTOK_URL_REGEX = /https:\/\/www\.tiktok\.com\/embed\/\d+/g;
export const TIKTOK_ID_REGEX = /\d{10,}/g;

const getTikTokId = (str) => {
  if ((TIKTOK_ID_REGEX.test(str) && str.length > 10) || TIKTOK_URL_REGEX.test(str)) {
    return str.match(TIKTOK_ID_REGEX)[0];
  }

  return str;
};

export default getTikTokId;
