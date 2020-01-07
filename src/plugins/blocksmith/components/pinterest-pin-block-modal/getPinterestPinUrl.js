const getPinterestPinUrl = (pin) => {
  const PINTEREST_PIN_URL_REGEX = /http?s:\/\/www\.pinterest\.com\/pin\/\w+/g;
  const PINTEREST_PIN_ID_REGEX = /^[0-9]*$/g;

  const isValidPinUrl = PINTEREST_PIN_URL_REGEX.test(pin);
  const isValidPinId = PINTEREST_PIN_ID_REGEX.test(pin);

  if (isValidPinUrl) {
    return pin.match(PINTEREST_PIN_URL_REGEX)[0];
  }

  return isValidPinId ? `https://pinterest.com/pin/${pin}` : '';
};

export default getPinterestPinUrl;
