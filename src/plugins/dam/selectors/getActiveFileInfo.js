import { createSelector } from 'reselect';
import getFileList from './getFileList';
import getActiveHashName from './getActiveHashName';

export default createSelector(
  getActiveHashName,
  getFileList,
  (hashName, files) => {
    if (!hashName) {
      return false;
    }

    return {
      hashName,
      ...files[hashName],
    };
  },
);