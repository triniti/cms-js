import React from 'react';
import { Button, Spinner } from 'reactstrap';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

function UploadingItem(props) {
  const { upload, onSelectUpload } = props;

  const handleClick = () => {
    onSelectUpload(upload.nameHash);
  };

  //onClick={upload.cancel}
  return (
    <Button
      outline
      size="sm"
      className="d-inline-block text-truncate w-100 ml-0 mr-0"
      color="info"
      onClick={handleClick}
    >
      <Spinner className="m-0 mr-2" color="info" width="16" strokeWidth="8" size="sm" />
      {upload.name}
    </Button>
  );
}

function CompletedItem(props) {
  const { isActive = false, upload, onSelectUpload } = props;

  const handleClick = () => {
    onSelectUpload(upload.nameHash);
  };

  return (
    <Button
      outline
      size="sm"
      className="d-inline-block text-truncate w-100 ml-0 mr-0"
      color="success"
      onClick={handleClick}
    >
      {isActive ? '(x) ' : ''}{upload.name} completed
    </Button>
  );
}

function FailedItem(props) {
  const { isActive = false, upload, onSelectUpload } = props;

  const handleClick = () => {
    onSelectUpload(upload.nameHash);
  };

  return (
    <Button
      outline
      size="sm"
      className="d-inline-block text-truncate w-100 ml-0 mr-0"
      color="danger"
      onClick={handleClick}
    >
      {isActive ? '(x) ' : ''}{upload.name} {upload.status} {upload.error}
    </Button>
  );
}

const components = {
  [uploadStatus.UPLOADING]: UploadingItem,
  [uploadStatus.COMPLETED]: CompletedItem,
  [uploadStatus.FAILED]: FailedItem,
  [uploadStatus.CANCELED]: FailedItem,
};

export default function FileList(props) {
  const { activeUpload, batch, onSelectUpload } = props;

  return (
    <div className="dam-file-list">
      {batch.values().map((upload) => {
        const Item = components[upload.status];
        return (
          <Item
            key={upload.nameHash}
            batch={batch}
            upload={upload}
            isActive={activeUpload === upload.nameHash}
            onSelectUpload={onSelectUpload}
          />
        );
      })}
    </div>
  );
}

