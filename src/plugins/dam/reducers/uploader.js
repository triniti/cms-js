import merge from 'lodash/merge';
import mime from 'mime-types';
import createReducer from '@triniti/app/createReducer';
import BigNumber from '@gdbots/pbj/well-known/BigNumber';
import GetUploadUrlsResponseV1Mixin
  from '@triniti/schemas/triniti/dam/mixin/get-upload-urls-response/GetUploadUrlsResponseV1Mixin';
import { actionTypes, fileUploadStatuses } from '../constants';
import { fromAssetId } from '../utils/assetFactory';

export const initialState = {
  files: {},
};

const {
  PATCH_ASSETS_REQUESTED,
  CLEAR_PROCESSED_FILES_REQUESTED,
  PROCESS_FILES_REQUESTED,
  PROCESS_FILE_COMPLETED,
  PROCESS_FILE_FAILED,
  PROCESSED_FILE_ASSET_UPDATED,
  PROCESSED_FILE_SELECTED,
  PROCESS_FILE_RETRY_REQUESTED,
  UPLOAD_FILE_STARTED,
  UPLOAD_FILE_FULFILLED,
  REMOVE_PROCESSED_FILE_REQUESTED,
} = actionTypes;

/**
 * @param {Object} prevState
 * @param {String} hashName
 * @param {Object} info An object with the fields you want to overwrite or add
 * @return {{files}}
 */
const updateFileInfo = (prevState, hashName, info = {}) => {
  const updatedFile = prevState.files[hashName] ? { [hashName]: info } : {};

  return {
    ...prevState,
    files: merge({}, prevState.files, updatedFile),
  };
};

/**
 * @param {Object} prevState
 * @param {Object} fileInfos An object containing
 * @return {{files}}
 */
const updateManyFileInfo = (prevState, fileInfos) => ({
  ...prevState,
  files: merge({}, prevState.files, fileInfos),
});

const onApplyToAll = (prevState, { pbj }) => {
  const paths = pbj.get('paths');

  // Create file object map with asset ids
  const fileInfos = Object.keys(prevState.files).reduce((accumulator, hashName) => {
    const prevFileInfo = prevState.files[hashName];
    const { asset } = prevFileInfo;
    const updatedAsset = asset.clone();
    /* eslint array-callback-return: off */
    paths.map((path) => {
      switch (path) {
        case 'credit':
        case 'expires_at':
          updatedAsset.set(path, pbj.get(path));
          break;
        default:
          break;
      }
    });
    /* eslint no-param-reassign: off */
    accumulator[hashName] = {
      asset: updatedAsset,
    };
    return accumulator;
  }, {});

  return updateManyFileInfo(prevState, fileInfos);
};

const onClearProcessedFiles = (prevState) => ({
  ...prevState,
  files: {},
});

const onProcessFilesRequested = (prevState, { files }) => {
  // Set first item to active if we are starting a fresh list
  if (!Object.keys(prevState.files).length) {
    const fileKeys = Object.keys(files);
    files[fileKeys[0]].active = true;
  }

  return {
    ...prevState,
    files: { ...prevState.files, ...files },
  };
};

const onProcessFileFailed = (prevState, { hashName, error }) => updateFileInfo(prevState, hashName, { status: fileUploadStatuses.ERROR, error });

const onProcessRetryRequested = (prevState, { hashName }) => updateFileInfo(prevState, hashName, { status: fileUploadStatuses.PROCESSING, error: null });

const onProcessFileCompleted = (prevState, { hashName }) => updateFileInfo(prevState, hashName, { status: fileUploadStatuses.COMPLETED });

const onUploadFileStarted = (prevState, { hashName }) => updateFileInfo(prevState, hashName, { status: fileUploadStatuses.UPLOADING });

const onUploadFileFulfilled = (prevState, { hashName, previewUrl }) => updateFileInfo(prevState, hashName, { status: fileUploadStatuses.UPLOADED, previewUrl, uploaded: true });

/**
 * Notes on removing an active file: When removing an active item, we want to flag the next item
 * on the list as active. This helps keeps the active pointer where the user last left off instead
 * of resetting to help provide a better experience.
 *
 * @param prevState
 * @param hashName
 * @return {Object}
 */
const onRemoveProcessedFileRequest = (prevState, { hashName }) => {
  let newActiveMap = { ...prevState.files };

  // If deleting an active asset, flag the next item as active.
  // If there is not a next item, flag the item prior as active.
  // If there are no more items, do nothing.
  if (newActiveMap[hashName].active) {
    const hashes = Object.keys(newActiveMap);
    if (hashes.length > 1) {
      let useNext = false;
      newActiveMap = hashes.reduce((accumulator, currHashName) => {
        /* eslint no-param-reassign: off */
        // Set next file as active and don't add anything to accumulator
        if (currHashName === hashName) {
          useNext = true;
          return accumulator;
        }

        // Set current file as active
        if (useNext === true) {
          useNext = false;
          accumulator[currHashName] = { ...newActiveMap[currHashName], active: true };
          return accumulator;
        }

        accumulator[currHashName] = newActiveMap[currHashName];
        return accumulator;
      }, {});

      // If we didn't find a next item to use, then flag the previous (aka last) item as active.
      if (useNext) {
        const newHashList = Object.keys(newActiveMap);
        if (newHashList.length) {
          newActiveMap[newHashList[newHashList.length - 1]].active = true;
        }
      }
    }
  }

  delete newActiveMap[hashName];

  return {
    ...prevState,
    files: newActiveMap,
  };
};

const onUpdateProcessedFileAsset = (prevState, { hashName, asset }) => updateFileInfo(
  prevState,
  hashName,
  { asset },
);

const onSelectProcessedFile = (prevState, { hashName }) => {
  const files = { ...prevState.files };
  Object.keys(files).forEach((currHashName) => {
    files[currHashName].active = currHashName === hashName;
  });

  return {
    ...prevState,
    files,
  };
};

/**
 * Attach Asset Ids to files
 * @param prevState
 * @param pbj
 */
const onGetUploadUrlsResponse = (prevState, { pbj }) => {
  // Create file object map with asset ids
  const assetIds = pbj.get('asset_ids');
  const fileInfos = Object.keys(assetIds).reduce((accumulator, hashName) => {
    const prevFileInfo = prevState.files[hashName];
    const asset = fromAssetId(assetIds[hashName]);
    asset.set('title', prevFileInfo.file.name);
    asset.set('mime_type', prevFileInfo.file.type || mime.lookup(prevFileInfo.file.name));
    asset.set('file_size', new BigNumber(prevFileInfo.file.size || 0));
    /* eslint no-param-reassign: off */
    accumulator[hashName] = {
      asset,
    };
    return accumulator;
  }, {});

  return updateManyFileInfo(prevState, fileInfos);
};

export default createReducer(initialState, {
  [PATCH_ASSETS_REQUESTED]: onApplyToAll,
  [CLEAR_PROCESSED_FILES_REQUESTED]: onClearProcessedFiles,
  [PROCESS_FILES_REQUESTED]: onProcessFilesRequested,
  [PROCESS_FILE_COMPLETED]: onProcessFileCompleted,
  [PROCESS_FILE_FAILED]: onProcessFileFailed,
  [PROCESS_FILE_RETRY_REQUESTED]: onProcessRetryRequested,
  [PROCESSED_FILE_ASSET_UPDATED]: onUpdateProcessedFileAsset,
  [PROCESSED_FILE_SELECTED]: onSelectProcessedFile,
  [UPLOAD_FILE_STARTED]: onUploadFileStarted,
  [UPLOAD_FILE_FULFILLED]: onUploadFileFulfilled,
  [REMOVE_PROCESSED_FILE_REQUESTED]: onRemoveProcessedFileRequest,
  [GetUploadUrlsResponseV1Mixin.findOne().getCurie()]: onGetUploadUrlsResponse,
});
