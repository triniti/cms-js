import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

export default class FileItem extends React.Component {
  static propTypes = {
    file: PropTypes.shape({}),
    hashName: PropTypes.string.isRequired,
    innerRef: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
  };

  static defaultProps = {
    file: {},
  };


  constructor(props) {
    super(props);

    this.handleErrBtnToggle = this.handleErrBtnToggle.bind(this);

    this.state = {
      errBtnOpen: false,
    };
  }

  handleErrBtnToggle() {
    this.setState(({ errBtnOpen }) => ({ errBtnOpen: !errBtnOpen }));
  }

  render() {
    const { file, hashName, onClick, onDelete, onRetry, innerRef } = this.props;
    const { errBtnOpen } = this.state;
    const options = {
      active: !!file.active,
    };

    if (file.status === 'ERROR') {
      return (
        <ButtonDropdown
          isOpen={errBtnOpen}
          toggle={this.handleErrBtnToggle}
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
            <span className="ml-auto mr-auto w-100 text-truncate">{file.file.name}</span>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => onRetry(file.error)}>Retry</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => onDelete(hashName)}>Delete</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      );
    }

    let color = 'light';
    let loading = null;
    switch (file.status) {
      case 'COMPLETED':
        color = 'success';
        break;
      case 'UPLOADED':
        color = 'info';
        break;
      case 'UPLOADING':
        loading = true;
        break;
      case 'PROCESSING':
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
        {loading && <Spinner className="m-0 mr-2" color="#08a0e8" width="16" strokeWidth="8" />} {file.file.name}
      </Button>
    );
  }
}
