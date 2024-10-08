import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import md5 from 'md5';
import mime from 'mime-types';
import noop from 'lodash-es/noop.js';
import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import BigNumber from '@gdbots/pbj/well-known/BigNumber.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import GetUploadUrlsRequestV1 from '@triniti/schemas/triniti/dam/request/GetUploadUrlsRequestV1.js';
import { getInstance } from '@triniti/app/main.js';
import { Icon, Loading } from '@triniti/cms/components/index.js';
import uploadFile from '@triniti/cms/plugins/dam/utils/uploadFile.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import receiveNodes from '@triniti/cms/plugins/ncr/actions/receiveNodes.js';
import getExt from '@triniti/cms/utils/getExt.js';
import delay from '@triniti/cms/utils/delay.js';
import getImageDimensions from '@triniti/cms/plugins/dam/utils/getImageDimensions.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

const getFileExtension = (file) => {
  // Return quick for known types
  switch (file.typeIdentifierBytes) {
    case '89504e47':
      return 'png';
    case '47494638':
      return 'gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'jpg';
  }

  return getExt(file.name);
};

const getCleanFileName = (file) => {
  const name = file.name.replace(/[^\w.]/g, '');
  const ext = getFileExtension(file) || '';
  return name.replace(`.${ext}`, '') + '.' + ext.toLowerCase();
};

const getUploadUrls = async (files, app) => {
  const pbjx = await app.getPbjx();
  const request = GetUploadUrlsRequestV1.create()
    .addToList('files', files);
  return await pbjx.request(request);
};

const createAsset = async (upload, app, dispatch, batch) => {
  const pbjx = await app.getPbjx();
  const id = upload.assetId;
  const Message = await MessageResolver.resolveCurie(`*:dam:node:${id.getType()}-asset:v1`);
  const asset = Message.create()
    .set('_id', id)
    .set('title', upload.file.name)
    .set('mime_type', upload.file.type || mime.lookup(upload.name))
    .set('file_size', new BigNumber(upload.file.size || 0));

  if (id.getType() === 'image') {
    try {
      const { width, height } = await getImageDimensions(damUrl(id));
      asset.set('width', width || 0);
      asset.set('height', height || 0);
    } catch (e) {
      console.error('Uploader.createAsset.getImageDimensions', upload, asset.toObject(), e);
    }
  }

  const { linkedRef, galleryRef, assetEnricher = noop } = batch.config;
  if (linkedRef) {
    asset.addToSet('linked_refs', [NodeRef.fromString(`${linkedRef}`)]);
  }

  if (galleryRef) {
    asset.set('gallery_ref', NodeRef.fromString(`${galleryRef}`));
    if (upload.gallerySeq !== null) {
      asset.set('gallery_seq', upload.gallerySeq);
    }
  }

  await assetEnricher(asset, upload, app);
  const CreateNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:create-node:v1');
  const command = CreateNodeV1.create().set('node', asset);
  await pbjx.send(command);
  return asset;
};

export default function Uploader(props) {
  const {
    batch,
    onUploadCompleted = noop,
    onRemoveUpload = noop,
    allowMultiple = true,
    maxFiles = 200,
    accept = []
  } = props;
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleDropAccepted = async (files) => {
    setProcessing(true);
    const app = getInstance();

    const names = [];
    for (let file of files) {
      names.push(getCleanFileName(file));
    }

    let response;
    try {
      response = await getUploadUrls(names, app);
      if (!isMounted.current) {
        return;
      }
    } catch (e) {
      console.error('Uploader.getUploadUrls', names, e);
      if (!isMounted.current) {
        return;
      }

      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
      return;
    }

    let i = 0;
    for (let file of files) {
      i++;
      if (i % 20 === 0) {
        await delay(2000);
      }

      const name = getCleanFileName(file);
      const nameHash = md5(name);
      const assetId = response.getFromMap('asset_ids', nameHash);
      const s3PresignedUrl = response.getFromMap('s3_presigned_urls', nameHash);
      const upload = {
        file,
        name,
        nameHash,
        assetId,
        s3PresignedUrl,
        status: uploadStatus.UPLOADING,
        cancelable: true,
        error: null,
        controller: new AbortController(),
        running: true,
        gallerySeq: null,
      };

      if (batch.config.galleryRef && batch.config.gallerySeqIncrementer) {
        upload.gallerySeq = batch.config.gallerySeqIncrementer();
      }

      const process = async () => {
        if (upload.status === uploadStatus.COMPLETED) {
          return upload.asset;
        }

        upload.status = uploadStatus.UPLOADING;
        upload.cancelable = true;
        upload.running = true;
        batch.refresh();

        let asset;
        try {
          await uploadFile({
            s3PresignedUrl: upload.s3PresignedUrl,
            file: upload.file,
            controller: upload.controller,
          });

          if (upload.controller.signal.aborted) {
            return;
          }

          upload.cancelable = false;
          batch.refresh();
          asset = await createAsset(upload, app, dispatch, batch);
        } catch (e) {
          upload.error = getFriendlyErrorMessage(e);
          upload.status = upload.controller.signal.aborted ? uploadStatus.CANCELED : uploadStatus.FAILED;
          upload.running = false;
          batch.refresh();
          return;
        }

        if (!isMounted.current) {
          return;
        }

        upload.cancel = noop;
        upload.retry = noop;
        upload.process = noop;
        upload.status = uploadStatus.COMPLETED;
        upload.running = false;
        upload.asset = asset;
        dispatch(receiveNodes([asset]));
        onUploadCompleted(upload.nameHash, asset);
        batch.refresh();
        return asset;
      };

      upload.retry = () => {
        upload.error = null;
        upload.controller = new AbortController();
        upload.result = process();
      };

      upload.cancel = () => {
        if (!upload.cancelable || upload.status === uploadStatus.COMPLETED) {
          return;
        }

        upload.status = uploadStatus.CANCELED;
        upload.error = uploadStatus.CANCELED;
        upload.running = false;
        upload.controller.abort();
        batch.refresh();
      };

      upload.remove = () => {
        upload.cancel = noop;
        upload.retry = noop;
        upload.process = noop;
        upload.running = false;
        upload.asset = null;
        onRemoveUpload(upload.nameHash);
        batch.remove(upload.nameHash);
      };

      upload.result = process();
      batch.add(upload);
    }

    batch.refresh();
    setProcessing(false);
  };

  const dropzone = useDropzone({
    disabled: processing || !allowMultiple && batch.size > 0,
    multiple: allowMultiple,
    maxFiles: allowMultiple ? maxFiles : 1,
    // convert ['text/html'] to accept['text/html'] = [];
    accept: accept.reduce((a, v) => {
      a[v] = [];
      return a;
    }, {}),
    onDropAccepted: handleDropAccepted,
  });

  return (
    <div {...dropzone.getRootProps()} className="dam-drop-zone-component m-3 mb-2 text-center rounded-3 border border-2 d-flex justify-content-center flex-column px-2">
      <input {...dropzone.getInputProps()} />
      {processing && (
        <Loading>Processing Files...</Loading>
      )}

      {dropzone.isDragActive && (
        <>
          <Icon imgSrc="cloud-upload" />
          <p className="mb-0">Drop the files here.</p>
        </>
      )}

      {!dropzone.isDragActive && !processing && (
        <>
          {(allowMultiple || batch.size === 0) && (
            <>
              <Icon imgSrc="cloud-upload" />
              <p className="mb-0">Drop files here, or click to select files to upload.</p>
            </>
          )}
          {!allowMultiple && batch.size > 0 && (
            <>
              <a onClick={batch.clear}>Clear uploads and start over.</a>
            </>
          )}
        </>
      )}

      {!dropzone.isDragActive && dropzone.fileRejections.map(({ file, errors }) => (
        <div key={file.name} className="alert-container">
          {errors.map(e => (
            <Alert key={e.code} color="danger">
              {e.message}
            </Alert>
          ))}
        </div>
      ))}
    </div>
  );
}
