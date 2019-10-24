import uuid from 'uuid/v4';
import md5 from 'md5';
import get from 'lodash/get';
import { incrementValues } from '../components/add-gallery-assets-modal';
import { actionTypes, fileUploadStatuses } from '../constants';
import getFileExtension from '../utils/getFileExtension';

/**
 * @param files Array of files
 * @param linkedRefs Array of linked references
 * @param galleryRef Gallery reference
 * @param lastGallerySequence Integer of the last item in the sequence
 * @param config Config object from delegate. Mostly requiring schemas
 * @param variant Object containing variant config such as { version, quality }
 */
export default (files, linkedRefs, galleryRef, lastGallerySequence, config, variant) => {
  const variantWithDefaults = { ...variant, version: get(variant, 'version', 'o') };

  return {
    type: actionTypes.PROCESS_FILES_REQUESTED,
    files: files.reduce((accumulator, file, index) => {
      const extension = getFileExtension(file).toLowerCase();
      const uuidName = `${uuid()}${extension ? `.${extension}` : ''}`;
      const hashName = md5(uuidName);
      const { version } = variantWithDefaults;
      const gallerySequence = galleryRef
        ? lastGallerySequence + (files.length - index) * incrementValues.ADD_GALLERY_ASSET_INCREMENT
        : 0;
      /* eslint no-param-reassign: off */
      accumulator[hashName] = {
        uuidName,
        file,
        status: fileUploadStatuses.PROCESSING,
        previewUrl: file.preview,
        asset: null,
        uploaded: false,
        error: false,
        gallerySequence,
        version,
      };

      return accumulator;
    }, {}),
    linkedRefs,
    galleryRef,
    config,
    variant: variantWithDefaults,
  };
};
