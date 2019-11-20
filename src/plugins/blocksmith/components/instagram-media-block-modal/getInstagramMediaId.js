
const getInstagramMediaId = (str) => {
  const regex = /\/(p|tv)\/([^/]+)\//g;
  const mediaId = str.match(regex);
  return mediaId[0].split('/')[2];
};

export default getInstagramMediaId;
