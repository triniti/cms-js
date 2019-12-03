const getInstagramMediaId = (str) => {
  const regex = RegExp('https://www.instagram.com/(p|tv)/[a-zA-Z0-9-/]+', 'g');
  const isValid = regex.test(str);
  const mediaId = str.match(regex);

  return isValid ? mediaId[0].split('/')[4] : null;
};

export default getInstagramMediaId;
