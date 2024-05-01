import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Spinner } from 'reactstrap';
import { useDispatch } from 'react-redux';
import damUrl from 'plugins/dam/damUrl';
import variants from 'plugins/dam/components/asset-screen/variants';
import Dropzone from 'react-dropzone';

// app
import GetUploadUrlsRequestV1 from '@triniti/schemas/triniti/dam/request/GetUploadUrlsRequestV1';
import { getInstance } from '@triniti/app/main.js';
import sendAlert from 'actions/sendAlert';

// dam
import fileToUuidName from 'plugins/dam/utils/fileToUuidName';
import uploadFile from 'plugins/dam/utils/uploadFile';


import 'plugins/dam/components/asset-screen/variants.scss';

// Error messages
const ERROR_MIME_TYPE = 'Invalid Action: Trying to upload invalid file type.';
const ERROR_ORIG_VERSION = 'Invalid Action: Original version cannot be overwritten.';
const ERROR_UPLOAD = 'Issue uploading file. Please try again.';

// State
const STATE_UPLOADING = 'uploading';

const getVariantSrc = (asset, version) => {
  const rand = `?r=${(new Date()).getTime()}`;
  return `${damUrl(asset, version, 'sm')}${rand}`;
};

const aspectRatioToCssClass = (aspectRatio) => `ratio ratio-${aspectRatio.replace('by','x')}`;

const getUploadUrls = async (file, asset, version) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  const uuidName = fileToUuidName(file);
  const request = GetUploadUrlsRequestV1.create().addToList('files', [uuidName]);
  if (asset && version) {
    request.set('version', version);
    request.set('asset_id', asset.get('_id'));
  }
  return pbjx.request(request);
};

export default function VariantsTab({ type, asset, editMode }) {

  const variantScope = variants[type];
  const appDispatch = useDispatch();
  const myController = new AbortController();
  const [ variantState, setVariantState ] = useState({});

  const handleFileDrop = (asset, version) => {
    return async (files) => {
      const file = files[0];

      // Display error if wrong mime type
      // Note: Variants only supports image right now
      if (file.type !== asset.get('mime_type')) {
        appDispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: ERROR_MIME_TYPE,
        }));
        return;
      }

      // Original version cannot be overwritten
      if (version === 'o') {
        appDispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: ERROR_ORIG_VERSION,
        }));
        return;
      }

      // Get URLs
      try {
        const uploadUrls = await getUploadUrls(file, asset, version);
        const s3PresignedUrls = uploadUrls.get('s3_presigned_urls');
        const postUrl = s3PresignedUrls[Object.keys(s3PresignedUrls)[0]];

        setVariantState({ ...variantState, [version]: STATE_UPLOADING });
        await uploadFile(file, postUrl, myController);
        setVariantState({ ...variantState, [version]: null });

      } catch (e) {
        console.log('Asset Variant:', e);
        appDispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: ERROR_UPLOAD,
        }));
      }

    };
  }

  return (
    <Card>
      <CardHeader>Variants</CardHeader>
        <CardBody className="pl-0 pe-0 pt-0 variants-body">
        <p>
            Click an image you would like to replace or drag a new image over it.
        </p>
        <div>
        {Object.keys(variantScope).map((version) => {
          const label = variantScope[version];
            return (
              <fieldset key={version} className="thumbnail">
                <legend>{label}</legend>
                <Dropzone
                  accept={{[asset.get('mime_type')]: []}}
                  multiple={false}
                  onDropAccepted={handleFileDrop(asset, version)}
                  disabled={!editMode}
                  >
                    {({ getRootProps, getInputProps }) => (
                    <>
                    <div {...getRootProps()} className={aspectRatioToCssClass(version)}>
                    {variantState[version] === STATE_UPLOADING ? (
                      <div id="spinner-box" className='container d-flex align-items-center justify-content-center'>
                        <Spinner className="position-absolute text-info" />
                      </div>
                    ) : (
                      <>
                        <input {...getInputProps()} />
                        <img src={getVariantSrc(asset, version)} alt={label} className={editMode ? 'editable' : ''} />
                      </>
                    )}
                    </div>
                    </>
                    )}
                </Dropzone>
              </fieldset>
            );
        })}
        </div>
      </CardBody>
    </Card>
  );
}
