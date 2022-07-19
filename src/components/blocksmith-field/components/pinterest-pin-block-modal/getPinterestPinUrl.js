const PINTEREST_PIN_URL_REGEX = /http?s:\/\/(www\.)?pinterest\.com\/pin\/\w+/;
const PINTEREST_PIN_ID_REGEX = /^[0-9]*$/;
let isValidPinUrl = false;
let isValidPinId = false;

const getPinterestPinUrl = pin => {
  isValidPinUrl = PINTEREST_PIN_URL_REGEX.test(pin);
  isValidPinId = PINTEREST_PIN_ID_REGEX.test(pin);

  if (isValidPinUrl) {
    return pin.match(PINTEREST_PIN_URL_REGEX)[0];
  }

  return isValidPinId ? `https://pinterest.com/pin/${pin}` : '';
};

export default getPinterestPinUrl;