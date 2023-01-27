import React, { useState } from 'react';
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from 'reactstrap';
import { fileUploadStatuses } from 'plugins/dam/constants';

export default (props) => {
  const {
    file = {},
    hashName,
    onClick,
    onDelete,
    onRetry,
    innerRef,
  } = props;

  const [ errBtnOpen, setErrBtnOpen ] = useState(false);

  const handleErrBtnToggle = () => {
    setErrBtnOpen(!errBtnOpen);
  }

  const options = {
    active: !!file.active,
  };

  if (file.status === fileUploadStatuses.ERROR) {
    return (
      <ButtonDropdown
        isOpen={errBtnOpen}
        toggle={handleErrBtnToggle}
        className="w-100  ml-0 mr-0"
      >
        <DropdownToggle
          caret
          outline
          color="danger"
          size="sm"
          className="justify-content-between mb-2 w-100"
          role="button"
          onClick={onClick}
          {...options}
        >
          <span className="ms-auto mr-auto w-100 text-truncate">{file.file.name}</span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => onRetry(hashName)}>Retry</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => onDelete(hashName)}>Delete</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }

  let color = 'light';
  let loading = null;
  switch (file.status) {
    case fileUploadStatuses.COMPLETED:
      color = 'success';
      break;
    case fileUploadStatuses.UPLOADED:
      color = 'info';
      break;
    case fileUploadStatuses.UPLOADING:
      loading = true;
      break;
    case fileUploadStatuses.PROCESSING:
    default:
      color = 'light';
      loading = true;
      break;
  }

  return (
    <Button
      innerRef={innerRef}
      outline
      color={color}
      size="sm"
      className="d-inline-block text-truncate w-100 ml-0 mr-0"
      role="button"
      onClick={onClick}
      {...options}
    >
      {loading && <Spinner className="m-0 mr-2" color="info" width="16" strokeWidth="8" size="sm" />} {file.file.name}
    </Button>
  );
}