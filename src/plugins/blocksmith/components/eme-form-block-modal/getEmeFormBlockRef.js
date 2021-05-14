import trim from 'lodash-es/trim';

const getEmeFormBlockRef = (str) => {
  const trimmed = trim(str);
  const parts = trimmed.split(':');
  if (parts.length !== 3) {
    return null;
  }

  return str;
};

export default getEmeFormBlockRef;
