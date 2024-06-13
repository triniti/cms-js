import { createSelector } from 'reselect';
import getFileList from '@triniti/cms/plugins/dam/selectors/getFileList.js';
import getActiveHashName from '@triniti/cms/plugins/dam/selectors/getActiveHashName.js';

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
