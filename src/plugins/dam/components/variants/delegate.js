import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import processFiles from '../../actions/processFiles';
import schemas from './schemas';
import getFileExtension from '../../utils/getFileExtension';
import clearProcessedFiles from '../../actions/clearProcessedFiles';

// Error messages
const errorMimeTypeMessage = 'Invalid Action: Trying to upload invalid file type.';
const errorExtensionMessage = 'Invalid Action: File extensions do not match. Please use a variant with a matching extension.';
const errorMultiAssetErrorMessage = 'Invalid Action: Trying to upload multiple assets.';
const errorVersionMessage = 'Invalid Action: Original version cannot be overwritten.';

const testExtensionMatch = (a, b) => {
  const jpeg = /jpe?g/; // ugh! really? lol
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (jpeg.test(aLower) && jpeg.test(bLower)) {
    return true;
  }
  return aLower === bLower;
};

export default (dispatch) => ({
  handleVariantFileDrop(asset, version) {
    return (files) => {
      // Display error if user tried to upload more than 1 file
      if (files.length > 1) {
        dispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: errorMultiAssetErrorMessage,
        }));
        return;
      }

      const file = files[0];
      const isImageMime = (new RegExp(/image\//)).test(file.type);

      // Display error if wrong mime type
      // Note: Variants only supports image right now
      if (!isImageMime) {
        dispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: errorMimeTypeMessage,
        }));
        return;
      }

      // Display error is file extensions are different
      const inputExt = getFileExtension(file);
      const assetExt = asset.get('_id').ext;
      if (isImageMime && !testExtensionMatch(inputExt, assetExt)) {
        dispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: errorExtensionMessage,
        }));
        return;
      }

      // Original version cannot be overwritten
      if (version === 'o') {
        dispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: errorVersionMessage,
        }));
        return;
      }

      dispatch(processFiles(files, null, null, null, { schemas }, { version, asset }));
    };
  },

  componentWillUnmount() {
    dispatch(clearProcessedFiles());
  },
});
