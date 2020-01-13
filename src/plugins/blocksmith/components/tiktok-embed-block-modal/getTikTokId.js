export const TIKTOK_URL_REGEX = /https:\/\/www\.tiktok\.com\/embed\/\d+/;
export const TIKTOK_ID_REGEX = /\d{10,}/;

const getTikTokId = (str) => {
  if ((TIKTOK_ID_REGEX.test(str) && str.length > 10) || TIKTOK_URL_REGEX.test(str)) {
    return {
      id: str.match(TIKTOK_ID_REGEX)[0],
      isValid: true,
    };
  }

  return {
    id: str,
    isValid: false,
  };
};

export default getTikTokId;
