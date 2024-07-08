import React from 'react';
import { Badge, Button, Spinner } from 'reactstrap';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';
import { Icon } from '@triniti/cms/components/index.js';

function UploadingItem(props) {
  const { upload, onSelectUpload } = props;

  const handleClick = () => {
    onSelectUpload(upload.nameHash);
  };

  return (
    <Button
      outline
      size="sm"
      className="d-inline-block text-truncate w-100 ms-0 me-0 text-start"
      color="light"
      onClick={handleClick}
    >
      <Spinner className="m-0 me-2" width="16" strokeWidth="8" size="sm" />
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
      size="sm"
      className={"d-inline-block text-truncate w-100 ms-0 me-0 text-start" + (isActive ? ' active focus-ring-box-shadow' : '')}
      color="success"
      onClick={handleClick}
    >
      <Icon imgSrc="check-outline" className="me-2" />
      {upload.name}
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
      size="sm"
      className={"d-inline-block text-truncate w-100 ms-0 me-0 text-start" + (isActive ? ' active focus-ring-box-shadow' : '')}
      color="danger"
      onClick={handleClick}
    >
      <Icon imgSrc="warning-outline-triangle" className="me-2" />
      {upload.name} <Badge color="black" pill className="bg-opacity-25">{upload.status}</Badge>
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

