
const getInstagramMediaId = (str) => {
  const validateUrl = RegExp('https?://www.instagram.com/(p|tv)/[a-zA-z0-9-]+', 'g');
  const stripId = RegExp('/(p|tv)/([^/]+)/', 'g');

  const isValid = validateUrl.test(str);
  const mediaId = str.match(stripId);

  return isValid && mediaId ? mediaId[0].split('/')[2] : null;
};

export default getInstagramMediaId;
