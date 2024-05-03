import noop from 'lodash-es/noop.js';
import React, { useReducer, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import swal from 'sweetalert2';
import md5 from 'md5';
import get from 'lodash-es/get';
import merge from 'lodash-es/merge'
import startCase from 'lodash-es/startCase';
import mime from 'mime-types';

// app
import { getInstance } from '@triniti/app/main.js';
import BigNumber from '@gdbots/pbj/well-known/BigNumber';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import clearAlerts from 'actions/clearAlerts';
import sendAlert from 'actions/sendAlert';
import toast from '@triniti/cms/utils/toast.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import updateNode from '@triniti/cms/plugins/ncr/actions/updateNode';

// dam
import damUrl from '@triniti/cms/plugins/dam/damUrl';
import { fileUploadStatuses } from '@triniti/cms/plugins/dam/constants';
import uploadFile, { getUploadUrls } from '@triniti/cms/plugins/dam/utils/uploadFile';
import { fromAssetId } from '@triniti/cms/plugins/dam/utils/assetFactory';
import imageUrlDimensions from '@triniti/cms/plugins/dam/utils/imageUrlDimensions';
import DropArea from '@triniti/cms/plugins/dam/components/uploader/DropArea';
import FileList from '@triniti/cms/plugins/dam/components/uploader/FileList';
import Form from '@triniti/cms/plugins/dam/components/uploader/Form';
import Paginator from '@triniti/cms/plugins/dam/components/uploader/Paginator';
import CommonFields from '@triniti/cms/plugins/dam/components/uploader/CommonFields';
import fileToUuidName from '@triniti/cms/plugins/dam/utils/fileToUuidName';

import 'plugins/dam/components/uploader/styles.scss';

const ADD_GALLERY_ASSET_INCREMENT = 500;

const confirmDone = async (text) => {
  return swal.fire({
    confirmButtonText: 'Yes',
    showCancelButton: true,
    text,
    title: 'Are you sure?',
    icon: 'warning',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary',
    },
  });
}

const extractAssetsFromFiles = (files) => {
  const assets = [];
  Object.keys(files).forEach((hashName) => {
    const fileInfo = files[hashName];
    if (fileInfo.uploaded) {
      assets.push(fileInfo.asset);
    }
  });

  return assets;
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


const processFiles = (files, galleryRef, lastGallerySequence, variant) => {
  const variantWithDefaults = { ...variant, version: get(variant, 'version', 'o') };
  return files.reduce((accumulator, file, index) => {
      const uuidName = fileToUuidName(file);
      const hashName = md5(uuidName);
      const { version } = variantWithDefaults;
      const gallerySequence = galleryRef
        ? lastGallerySequence + (files.length - index) * incrementValues.ADD_GALLERY_ASSET_INCREMENT
        : 0;
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

  for (const hashName of hashNames) {
    const fileInfo = files[hashName];
    if (fileInfo.active) {
      return hashName;
    }
  }

  return null;
}

const reducer = (prevFiles, action) => {
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

const Uploader = ({
  allowedMimeTypes = [],
  allowMultiUpload = true,
  hasFilesProcessing = false,
  isOpen = false,
  lastGallerySequence = 0,
  onToggleUploader,
  linkedRefs,
  galleryRef,
  gallerySequence,
  variant = {},
  onClose: handleClose = noop,
}) => {

  const appDispatch = useDispatch();
  const [ files, dispatch ] = useReducer(reducer, {});
  const [ isFormDirty, setIsFormDirty ] = useState(false);
  const formStateRef = useRef();
  const currentFormRef = useRef();
  const currentNodeRef = useRef();
  const delegateRef = useRef({
    onAfterReinitialize: noop,
    shouldReinitialize: true,
    reinitialize: false,
  });
  const refreshNodeRef = useRef();
  const activeHashName = getActiveHashName(files);
  const activeAsset = files[activeHashName]?.asset;
  const activeAssetStatus = files[activeHashName]?.status;
  const activeAssetError = files[activeHashName]?.error;
  const hasMultipleFiles = Object.keys(files).length > 1;

  // const { submitting, isRefreshing, dirty, valid, hasSubmitErrors } = formStateRef?.current;
  // const enableSaveChanges = submitting || isRefreshing || !isFormDirty || (!valid && !hasSubmitErrors);
  const enableSaveChanges = isFormDirty && formStateRef.current.valid;

  const handleFileDrop = async (droppedFiles) => {
    const newFormattedFiles = processFiles(droppedFiles, galleryRef, lastGallerySequence); // formats list with hash

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
      console.log('Uploader: Issue uploading files.', e);
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
        const { file, gallerySequence } = processedFiles[hashName];
        const postUrl = s3PresignedUrls[hashName];
        dispatch({ type: 'uploadFileStarted', hashName });
        await uploadFile(file, postUrl, myController);
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
          asset.set('gallery_ref', NodeRef.fromString(galleryRef));
        }
        if (gallerySequence) {
          asset.set('gallery_seq', gallerySequence);
        }

        // Specific logic for asset types with custom data. In this case, only image assets have
        // specifics to be set. Something fancier can be mocked up when each asset type has
        // different logic.
        if (asset.get('_id').getType() === 'image') {
          const { width, height } = await imageUrlDimensions(damUrl(asset));
          asset.set('width', width);
          asset.set('height', height);
        }
        dispatch({ type: 'updateProcessedFileAsset', hashName, asset });

        // Save to DB
        const command = CreateNodeV1.create().set('node', asset);
        await pbjx.send(command);
        dispatch({ type: 'processCompleted', hashName});
      } catch (e) {
        console.log('Uploader: Issue processing files.', e);
        dispatch({ type: 'processFileFailed', hashName, error: e });
      }
    }
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

  const handleSelectFile = (hashName) => {
    delegateRef.current = {
      onAfterReinitialize: noop,
      shouldReinitialize: true,
      reinitialize: false,
    };
    dispatch({ type: 'selectFile', hashName });
  }

  const patchAssets = async (field) => {
    const app = getInstance();
    const pbjx = await app.getPbjx();
    const { current: form } = currentFormRef;
    const refs = [];
    Object.keys(files).map(k => {
      refs.push(NodeRef.fromNode(files[k].asset));
    });
    const PatchAssetsV1 = await MessageResolver.resolveCurie(`${APP_VENDOR}:dam:command:patch-assets:v1`);
    const paths = [field];
    const value = form.getFieldState(field).value;
    const command = PatchAssetsV1.create()
    .addToSet('node_refs', refs)
    .addToSet('paths', paths)
    .set(field, field === 'expires_at' ? new Date(value) : value);
    await pbjx.send(command);
  }

  const handleApplyAll = async (field) => {
    await progressIndicator.show(`Applying ${startCase(field)} to uploaded assets...`);
    try {
      await patchAssets(field);
      await progressIndicator.close();
      appDispatch(clearAlerts());

      const { current: delegate } = delegateRef;
      delegate.shouldReinitialize = true;

      setTimeout(refreshNodeRef.current);
    } catch (e) {
      await progressIndicator.close();
      const message = getFriendlyErrorMessage(e);
      appDispatch(sendAlert({ type: 'danger', message }));
    }
  }

  const handleFormSubmit = async (/*values, node*/) => {
    const { current: form } = currentFormRef;
    const { current: node } = currentNodeRef;
    const { values } = formStateRef.current;
    try {
      const ref = NodeRef.fromNode(activeAsset);
      await progressIndicator.show(`Saving ${startCase(ref.getLabel())}...`);
      await appDispatch(updateNode(values, form, node));

      await progressIndicator.close();
      toast({ title: `${startCase(ref.getLabel())} saved.` });
      appDispatch(clearAlerts());

      const { current: delegate } = delegateRef;
      delegate.shouldReinitialize = true;

      setTimeout(refreshNodeRef.current);
    } catch (e) {
      await progressIndicator.close();
      const message = getFriendlyErrorMessage(e);
      appDispatch(sendAlert({ type: 'danger', message }));
    }

    await form.submit();
  };

  const handleToggleUploader = (toggleAllModals = false) => {
    // If no files exist
    if (!activeHashName) {
      onToggleUploader();
      handleClose(extractAssetsFromFiles(files));
      return;
    }

    if (hasFilesProcessing || formStateRef.current.dirty) {
      const confirmText = hasFilesProcessing
        ? 'Some files are still processing. Exiting early will cause an interruption and files may not be saved.'
        : 'Do you want to leave the form without saving?';
      confirmDone(confirmText).then(({ value }) => {
        if (value) {
          if (hasFilesProcessing) {
            // delegate.flushProcessedFilesChannels();
          }
          onToggleUploader(activeAsset || null, toggleAllModals);
          handleClose(extractAssetsFromFiles(files));
        } else {
          // do nothing, user declined
        }
      });
    } else {
      onToggleUploader(activeAsset || null, toggleAllModals);
      handleClose(extractAssetsFromFiles(files));
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={() => handleToggleUploader(false)} size="lg" className='modal-dialog-centered'>
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
                  {activeHashName && activeAsset && activeAssetStatus === fileUploadStatuses.COMPLETED
                    && (
                      <Form
                        id={`${activeAsset.get('_id')}`}
                        label={`${activeAsset.get('_id').getType()}-asset`}
                        currentFormRef={currentFormRef}
                        currentNodeRef={currentNodeRef}
                        formStateRef={formStateRef}
                        refreshNodeRef={refreshNodeRef}
                        commonFieldsComponent={CommonFields}
                        allowMultiUpload={allowMultiUpload}
                        hasMultipleFiles={hasMultipleFiles}
                        setIsFormDirty={setIsFormDirty}
                        onSubmit={handleFormSubmit}
                        delegateRef={delegateRef}
                        onApplyAllCredit={() => handleApplyAll('credit')}
                        onApplyAllExpiresAt={() => handleApplyAll('expires_at')}
                      />
                    )}
                  {activeHashName && [fileUploadStatuses.COMPLETED, fileUploadStatuses.ERROR].indexOf(activeAssetStatus) == -1 && <h3>Processing...</h3>}
                  {activeHashName && activeAssetStatus === fileUploadStatuses.ERROR && (
                    <>
                      <h3>Error</h3>
                      <Card>
                        <CardBody>
                          <code>{activeAssetError.toString()}</code>
                        </CardBody>
                      </Card>
                    </>
                  )}
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
          <div className="ms-auto pe-3">
            {activeHashName && activeAsset && activeAssetStatus === fileUploadStatuses.COMPLETED
              && (
                  <div>
                    <Button
                      onClick={handleFormSubmit}
                      disabled={!enableSaveChanges}
                      className="btn-light"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => handleToggleUploader(true)}
                      disabled={hasFilesProcessing}
                      className="btn-light"
                    >
                      Done
                    </Button>
                  </div>
            )}
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Uploader;
