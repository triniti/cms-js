import { createSelector } from 'reselect';
import getFileList from './getFileList';

export default createSelector(
  getFileList,
  (files) => {
    const hashNames = Object.keys(files);

    if (!hashNames.length) {
      return null;
    }

    /* eslint no-restricted-syntax: off */
    for (const hashName of hashNames) {
      const fileInfo = files[hashName];
      if (fileInfo.active) {
        return hashName;
      }
    }

    return null;
  },
);
