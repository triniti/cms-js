import mime from 'mime-types';

export const getFileExtensionByName = (str) => {
  const strParts = str.split('.');
  if (strParts.length > 1) {
    return strParts.pop();
  }
  return '';
};

export default (file) => {
  // Return quick for known types
  /* eslint default-case: off */
  switch (file.typeIdentifierBytes) {
    case '89504e47':
      return mime.extension('image/png');
    case '47494638':
      return mime.extension('image/gif');
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return mime.extension('image/jpeg');
  }

  return getFileExtensionByName(file.name);
};
