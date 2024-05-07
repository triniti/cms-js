import { createSelector } from 'reselect';
import getFileList from '@triniti/cms/plugins/dam/selectors/getFileList.js';

export default createSelector(
  getFileList,
  (files) => {
    const hashNames = Object.keys(files);

    if (!hashNames.length) {
      return null;
    }

    for (const hashName of hashNames) {
      const fileInfo = files[hashName];
      if (fileInfo.active) {
        return hashName;
      }
    }

    return null;
  },
);
