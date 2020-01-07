const getPinterestPinId = (pin) => {
  const urlRegex = /http?s:\/\/www\.pinterest\.com\/pin\/\w+/g;
  const idRegex = /^[0-9]*$/g;
  const isUrl = urlRegex.test(pin);
  const isValidId = idRegex.test(pin);

  if (isUrl) {
    return pin.match(urlRegex)[0];
  }

  return isValidId ? pin : '';
};

export default getPinterestPinId;
