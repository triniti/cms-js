import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, { useState, useReducer } from 'react';
import swal from 'sweetalert2';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from 'components';
import merge from 'lodash-es/merge'
import { fileUploadStatuses } from 'plugins/dam/constants';
import damUrl from 'plugins/dam/damUrl';

import { v4 as uuid } from 'uuid';
import md5 from 'md5';
import get from 'lodash/get';
import { incrementValues } from 'plugins/dam/components/add-gallery-assets-modal';
import getFileExtension from 'plugins/dam/utils/getFileExtension';

import uploadFile, { getUploadUrls } from 'plugins/dam/utils/uploadFile';
import { fromAssetId } from 'plugins/dam/utils/assetFactory';
import mime from 'mime-types';
import BigNumber from '@gdbots/pbj/well-known/BigNumber';
import { getInstance } from '@app/main';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import getImageUrlDimensions from 'plugins/dam/utils/getImageUrlDimensions';

// import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

// import delegateFactory, { Delegate } from './delegate';
import DropArea from './DropArea';
import FileList from './FileList';
import Form from './Form';
import Paginator from './Paginator';
// import useDelegate from 'plugins/dam/components/uploader/useDelegate';
import DetailsTab from 'plugins/dam/components/asset-screen/DetailsTab';

import './styles.scss';

const confirmDone = async (text) => {
  return swal.fire({
    cancelButtonClass: 'btn btn-secondary',
    confirmButtonClass: 'btn btn-danger',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    text,
    title: 'Are you sure?',
    type: 'warning',
    reverseButtons: true,
  });
}

/**
 * @param {Object} prevState
 * @param {String} hashName
 * @param {Object} info An object with the fields you want to overwrite or add
 * @return {{files}}
 */
const updateFileInfo = (files, hashName, info = {}) => {
  const updatedFile = files[hashName] ? { [hashName]: info } : {};
  return merge({}, files, updatedFile);
};

function reducer(prevFiles, action) {
  const { type, hashName = null, info = {}, asset = null, previewUrl = null, files = {}, error = null } = action;

  switch (type) {
    case 'setFiles':
      return { ... files };
      break;
    case 'selectFile':
      const selectFile = { ... prevFiles };
      Object.keys(prevFiles).forEach((currHashName) => {
        selectFile[currHashName].active = currHashName === hashName;
      });
      return selectFile;
      break;
    case 'updateFileInfo':
      return updateFileInfo(prevFiles, hashName, info);
      break;
    case 'uploadFileStarted':
      return updateFileInfo(prevFiles, hashName, { status: fileUploadStatuses.UPLOADING });
      break;
    case 'uploadFileFulfilled':
      return updateFileInfo(prevFiles, hashName, { status: fileUploadStatuses.UPLOADED, previewUrl, uploaded: true });
      break;
    case 'updateProcessedFileAsset':
      return updateFileInfo(prevFiles, hashName, { asset });
      break;
    case 'processFileFailed':
        return updateFileInfo(prevFiles, hashName, { status: fileUploadStatuses.ERROR, error });
        break;
    case 'processRetryRequested':
        return updateFileInfo(prevFiles, hashName, { status: fileUploadStatuses.PROCESSING, error: null });
        break;
    case 'processCompleted':
        return updateFileInfo(prevFiles, hashName, { status: fileUploadStatuses.COMPLETED });
        break;
  }
}

const processFiles = (files, galleryRef, lastGallerySequence, variant) => {
  const variantWithDefaults = { ...variant, version: get(variant, 'version', 'o') };
  return files.reduce((accumulator, file, index) => {
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
    },
  {});
}

const getActiveHashName = files => {
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
}

const Uploader = (props) => {
  const {
    allowedMimeTypes = [],
    allowMultiUpload = true,
    currentValues = {},
    enableCreditApplyAll = false,
    enableExpirationDateApplyAll = false,
    enableSaveChanges = false,
    hasFilesProcessing = false,
    hasMultipleFiles = false,
    isFormDirty = false,
    isOpen = false,
    lastGallerySequence = 0,
    mimeTypeErrorMessage = 'Invalid Action: Trying to upload invalid file type.',
    onClose = noop,
    onToggleUploader,
    linkedRefs,
    galleryRef,
    gallerySequence,
    variant = {},
  } = props;

  const [ files, dispatch ] = useReducer(reducer, {});
  const activeHashName = getActiveHashName(files);
  const activeAsset = files[activeHashName]?.asset;

  // const delegate = useDelegate({
  //   ...props,
  //   mimeTypeErrorMessage,
  // });
  
  const handleFileDrop = async (droppedFiles) => {
    const newFormattedFiles = processFiles(droppedFiles); // formats list with hash

    // Set first item to active if we are starting a fresh list
    if (!Object.keys(files).length) {
      const fileKeys = Object.keys(newFormattedFiles);
      newFormattedFiles[fileKeys[0]].active = true;
    }

    const mergedFiles = { ...files, ...newFormattedFiles };
    dispatch({ type: 'setFiles', files: mergedFiles });

    try {
      await uploadProcessedFiles(newFormattedFiles);
    } catch (e) {
      console.log('Uploader: Issue uploading files', e);
    }
  };

  const uploadProcessedFiles = async (processedFiles) => {
    const app = getInstance();
    const pbjx = await app.getPbjx();
    const CreateNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:create-node:v1');
    const myController = new AbortController();

    // Get Upload URLs
    const uploadUrls = await getUploadUrls(processedFiles, variant);
    const s3PresignedUrls = uploadUrls.get('s3_presigned_urls');
    const assetIds = uploadUrls.get('asset_ids');

    // Begin uploading the process
    const proccessedFilesKeys = Object.keys(processedFiles);
    for (let i = 0; i < proccessedFilesKeys.length; i++) {
      let hashName = proccessedFilesKeys[i];
      try {
        const { file } = processedFiles[hashName];
        const postUrl = s3PresignedUrls[hashName];
        dispatch({ type: 'uploadFileStarted', hashName });
        await uploadFile(file, postUrl, variant, myController);
        dispatch({ type: 'uploadFileFulfilled', hashName });

        // Attach asset to files
        const asset = await fromAssetId(assetIds[hashName]);
        asset.set('title', file.name);
        asset.set('mime_type', file.type || mime.lookup(file.name));
        asset.set('file_size', new BigNumber(file.size || 0));

        // Attaches assets to specified refs
        if (linkedRefs) {
          asset.addToSet('linked_refs', linkedRefs);
        }
        if (galleryRef) {
          asset.set('gallery_ref', galleryRef);
        }
        if (gallerySequence) {
          asset.set('gallery_seq', gallerySequence);
        }

        // Specific logic for asset types with custom data. In this case, only image assets have
        // specifics to be set. Something fancier can be mocked up when each asset type has
        // different logic.
        if (asset.get('_id').getType() === 'image') {
          const { width, height } = await getImageUrlDimensions(damUrl(asset));
          asset.set('width', width);
          asset.set('height', height);
        }
        dispatch({ type: 'updateProcessedFileAsset', hashName, asset });

        // Save to DB
        const command = CreateNodeV1.create().set('node', asset);
        await pbjx.send(command);
        // await new Promise(resolve => setTimeout(resolve, 3000));
        dispatch({ type: 'processCompleted', hashName});
      } catch (e) {
        console.log('Issue uploading files', e);
        dispatch({ type: 'processFileFailed', hashName, info: { error: e } });
      }
    }
    // Object.keys(processedFiles).map(async hashName => {
    // });
  }

  const handleRetryUpload = async (hashName) => {
    dispatch({ type: 'processRetryRequested', hashName });
    await uploadProcessedFiles({ [hashName]: files[hashName] });
  }

  /**
   * Notes on removing an active file: When removing an active item, we want to flag the next item
   * on the list as active. This helps keeps the active pointer where the user last left off instead
   * of resetting to help provide a better experience.
   */
  const handleRemoveProcessedFile = (hashName) => {
    let newActiveMap = { ...files };
  
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
    dispatch({ type: 'setFiles', files: newActiveMap });
  };

  const handleSelectFile = (hashName) => dispatch({ type: 'selectFile', hashName });
  
  const onGetUploadUrlsResponse = ({ pbj }) => {
    // Create file object map with asset ids
    const assetIds = pbj.get('asset_ids');
    const fileInfos = Object.keys(assetIds).reduce((accumulator, hashName) => {
      const prevFileInfo = files[hashName];
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
  
    return updateManyFileInfo(fileInfos);
  };

  const handleToggleUploader = (toggleAllModals = false) => {
    // If no files exist
    if (!activeHashName) {
      onToggleUploader();
      return;
    }

    if (hasFilesProcessing || isFormDirty) {
      const confirmText = hasFilesProcessing
        ? 'Some files are still processing. Exiting early will cause an interruption and files may not be saved.'
        : 'Do you want to leave the form without saving?';
      confirmDone(confirmText).then(({ value }) => {
        if (value) {
          if (hasFilesProcessing) {
            // delegate.flushProcessedFilesChannels();
          }
          onToggleUploader(activeAsset || null, toggleAllModals);
        } else {
          // do nothing, user declined
        }
      });
    } else {
      onToggleUploader(activeAsset || null, toggleAllModals);
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={() => handleToggleUploader(false)} size="lg">
        <ModalHeader toggle={() => handleToggleUploader(false)}>
          Upload Assets
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="dam-uploader-wrapper">
            <div className="dam-content">
              <div className="dam-left-col">
                <div className="dam-drop-zone">
                  <DropArea
                    allowedMimeTypes={allowedMimeTypes}
                    allowMultiUpload={allowMultiUpload}
                    files={files}
                    onDrop={handleFileDrop}
                  />
                </div>
                <div className="dam-file-queue">
                  <FileList
                    activeHashName={activeHashName}
                    files={files}
                    isFormDirty={isFormDirty}
                    onRetry={handleRetryUpload}
                    onDelete={handleRemoveProcessedFile}
                    onSelectFile={handleSelectFile}
                  />
                </div>
              </div>

              <div className="meta-form border-left">
                <Card className="pt-3 px-3 pb-1 mb-0">
                  {activeHashName && activeAsset
                    // Form `key` is REQUIRED to update the form
                    // when activeHashName has changed
                    && (
                      <>
                        <Form
                          id={activeAsset.get('_id').toString()}
                          label={`${activeAsset.get('_id').getType()}-asset`}
                          editMode={true}
                        />
                      </>
                      //   // key={delegate.getFormName()}
                      //   // form={delegate.getFormName()}
                      //   key={'randokey'}
                      //   form={'randoName'}
                      //   activeHashName={activeHashName}
                      //   currentValues={currentValues}
                      //   enableCreditApplyAll={enableCreditApplyAll}
                      //   enableExpirationDateApplyAll={enableExpirationDateApplyAll}
                      //   files={files}
                      //   onCreditApplyToAll={() => {}}
                      //   onExpiresAtApplyToAll={() => {}}
                      //   // onCreditApplyToAll={delegate.handleCreditApplyAll}
                      //   // onExpiresAtApplyToAll={delegate.handleExpiresAtApplyAll}
                      //   hasMultipleFiles={hasMultipleFiles}
                      //   // initialValues={delegate.getInitialValues()}
                      //   initialValues={() => {}}
                      //   node={activeAsset}
                      //   validate={delegate.handleValidate}
                      //   warn={delegate.handleWarn}
                      //   onSave={delegate.handleSave}
                      //   onSubmit={delegate.handleSubmit}
                      //   uploadedFiles={uploadedFiles}
                      // />
                    )}
                  {activeHashName && !activeAsset && <h3>Processing...</h3>}
                  {!activeHashName && 'Add files using the component to the left.'}
                </Card>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="p-0">
          <div className="align-self-start dam-pagination-col">
            <Paginator
              files={files}
              onSelectFile={handleSelectFile}
              className="m-auto"
            />
          </div>
          {activeHashName && activeAsset
            && (
              <div className="ml-auto pr-3">
                <div>
                  <Button
                    // onClick={delegate.handleSave}
                    onClick={() => {}}
                    disabled={!enableSaveChanges}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => handleToggleUploader(true)}
                    disabled={hasFilesProcessing}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
        </ModalFooter>
      </Modal>
    </div>
  );
}

Uploader.propTypes = {
  activeAsset: PropTypes.instanceOf(Message),
  activeHashName: PropTypes.string,
  allowedMimeTypes: PropTypes.arrayOf(PropTypes.string),
  allowMultiUpload: PropTypes.bool,
  currentValues: PropTypes.shape({}),
  // delegate: PropTypes.instanceOf(Delegate).isRequired,
  enableCreditApplyAll: PropTypes.bool,
  enableExpirationDateApplyAll: PropTypes.bool,
  enableSaveChanges: PropTypes.bool,
  // files: PropTypes.shape({ hashName: PropTypes.shape({}) }).isRequired,
  hasFilesProcessing: PropTypes.bool,
  hasMultipleFiles: PropTypes.bool,
  isFormDirty: PropTypes.bool,
  isOpen: PropTypes.bool,
  lastGallerySequence: PropTypes.number,
  mimeTypeErrorMessage: PropTypes.string,
  /* eslint react/no-unused-prop-types: off */
  onClose: PropTypes.func, // This is used in the delegate
  onToggleUploader: PropTypes.func.isRequired,
  linkedRefs: PropTypes.arrayOf(NodeRef),
  galleryRef: PropTypes.instanceOf(NodeRef),
  gallerySequence: PropTypes.number,
  uploadedFiles: PropTypes.shape({ hashName: PropTypes.shape({}) }),
  variant: PropTypes.shape({
    version: PropTypes.string,
    asset: PropTypes.instanceOf(NodeRef),
  }),
}

// export default connect(
//   selector,
//   // createDelegateFactory(delegateFactory),
// )(Uploader);
// export default connect(selector)(Uploader);
export default Uploader;
