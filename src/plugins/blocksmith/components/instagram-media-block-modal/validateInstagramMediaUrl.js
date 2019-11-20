const validateInstagramMeidaURL = (str) => {
  const regex = RegExp('https?://www.instagram.com/(p|tv)/[a-zA-z0-9-]+', 'g');
  return regex.test(str);
};

export default validateInstagramMeidaURL;
