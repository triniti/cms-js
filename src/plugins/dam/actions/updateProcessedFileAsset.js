import { actionTypes } from '../constants';

export default (hashName, asset) => ({
  type: actionTypes.PROCESSED_FILE_ASSET_UPDATED,
  hashName,
  asset,
});
