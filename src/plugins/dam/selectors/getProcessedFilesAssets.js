import { fileUploadStatuses } from '../constants';

export default ({ dam }) => {
  const { files } = dam.uploader;

  if (!files) {
    return null;
  }

  const assets = Object.keys(dam.uploader.files).reduce((accumulator, hashName) => {
    const fileInfo = files[hashName];
    if (fileInfo.status === fileUploadStatuses.COMPLETED) {
      accumulator.push(fileInfo.asset);
    }
    return accumulator;
  }, []);

  return assets.length ? assets : null;
};
