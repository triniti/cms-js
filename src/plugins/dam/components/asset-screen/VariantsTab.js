import React, { useEffect, useRef, useState } from 'react';
import { Alert, Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import md5 from 'md5';
import GetUploadUrlsRequestV1 from '@triniti/schemas/triniti/dam/request/GetUploadUrlsRequestV1.js';
import { getInstance } from '@triniti/app/main.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import uploadFile from '@triniti/cms/plugins/dam/utils/uploadFile.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Loading } from '@triniti/cms/components/index.js';

const variants = {
  '16by9': 'Widescreen - 16:9',
  '5by4': 'Horizontal - 5:4',
  '4by3': 'Horizontal - 4:3',
  '3by2': 'Horizontal - 3:2',
  '1by1': 'Square - 1:1',
  '2by3': 'Vertical - 2:3',
  '3by4': 'Vertical - 3:4',
  '4by5': 'Vertical - 4:5',
  '5by6': 'Gallery - 5:6',
  '6by5': 'Gallery - 6:5',
  '9by16': 'Long Vertical - 9:16',
};

const getUploadUrl = async (assetId, version) => {
  const filename = `${assetId.getUuid()}_${version}.${assetId.getExt()}`;
  const filenameHash = md5(filename);
  const app = getInstance();
  const pbjx = await app.getPbjx();
  const request = GetUploadUrlsRequestV1.create()
    .addToList('files', [filename])
    .set('asset_id', assetId)
    .set('version', version);
  const response = await pbjx.request(request);
  return response.getFromMap('s3_presigned_urls', filenameHash);
};

const getPreviewUrl = (assetId, version) => {
  const d = new Date();
  const rand = `?r=${d.getTime()}${d.getMilliseconds()}`;
  return `${damUrl(assetId, version, 'sm')}${rand}`;
};

function ImageVariant(props) {
  const dispatch = useDispatch();
  const [previewUrl, setPreviewUrl] = useState(props.previewUrl);
  const [uploading, setUploading] = useState(false);
  const [controller, setController] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      if (controller) {
        controller.abort();
      }
      isMounted.current = false;
    };
  }, []);

  const { node, version } = props;

  const handleDropAccepted = async (files) => {
    setUploading(true);
    const myController = new AbortController;
    setController(myController);
    const assetId = node.get('_id');

    try {
      const s3PresignedUrl = await getUploadUrl(assetId, version);
      await uploadFile({ assetId, s3PresignedUrl, file: files[0], controller: myController });
      // send purge cache command now too?

      if (!isMounted.current) {
        return;
      }

      setPreviewUrl(getPreviewUrl(assetId, version));
    } catch (e) {
      console.error('VariantsTab.handleDropAccepted', node.toObject(), version, getFriendlyErrorMessage(e));
      if (!isMounted.current) {
        return;
      }

      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }

    setController(null);
    setUploading(false);
  };

  const dropzone = useDropzone({
    disabled: uploading || props.disabled,
    multiple: false,
    maxFiles: 1,
    accept: { [node.get('mime_type')]: [] },
    onDropAccepted: handleDropAccepted,
  });

  return (
    <fieldset className="g-col-12 g-col-sm-6">
      <legend>{variants[version]}</legend>
      <div {...dropzone.getRootProps()} className={`ratio ratio-${version.replace('by', 'x')} hover-box-shadow`}>
        <input {...dropzone.getInputProps()} />
        {uploading && (
          <Loading overlay>Uploading File...</Loading>
        )}

        {dropzone.isDragActive && (
          <p>Drop the file here to replace the {variants[version]}.</p>
        )}

        {!dropzone.isDragActive && !uploading && (
          <img
            src={previewUrl}
            alt={variants[version]}
            width={200}
            height={200}
            className="bg-body-secondary object-fit-contain" style={{ objectPosition: 'top left' }}
          />
        )}

        {!dropzone.isDragActive && dropzone.fileRejections.map(({ file, errors }) => (
          <div key={file.path}>
            {errors.map(e => (
              <Alert key={e.code} color="danger">
                {e.message}
              </Alert>
            ))}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export default function VariantsTab(props) {
  const { node, qname } = props;
  const policy = usePolicy();
  const canUpdate = policy.isGranted(`${qname}:update`);

  return (
    <Card>
      <CardHeader>Variants</CardHeader>
      <CardBody>
        {canUpdate && <CardText>Click an image you would like to replace or drag a new image over it.</CardText>}
        <div className="grid" style={{ alignItems: 'start' }}>
          {Object.keys(variants).map((version) => {
            const previewUrl = damUrl(node, version, 'sm');
            return (
              <ImageVariant
                disabled={!canUpdate}
                key={version}
                version={version}
                previewUrl={previewUrl}
                {...props}
              />
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
