// @TODO: Gallery media should be refreshed when patch assets is executed to update titles
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';
import { connect } from 'react-redux';

import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import delegate from './delegate';
import Form from './Form';
import selector from './selector';

import './styles.scss';


class BatchEdit extends React.Component {
  static async confirmDone(text) {
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

  static propTypes = {
    assetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    allowMultiUpload: PropTypes.bool,
    currentValues: PropTypes.shape({
      credit: PropTypes.object,
      expiresAt: PropTypes.instanceOf(Date),
    }),
    getFormName: PropTypes.func.isRequired,
    getNode: PropTypes.func,
    hasMultipleFiles: PropTypes.bool,
    initialValues: PropTypes.shape({}),
    isFormDirty: PropTypes.bool,
    isFormPristine: PropTypes.bool,
    isFormValid: PropTypes.bool,
    isOpen: PropTypes.bool,
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
    /* eslint react/no-unused-prop-types: off */
    onClose: PropTypes.func, // This is used in the delegate
    onHandleReset: PropTypes.func.isRequired,
    onHandleUpdate: PropTypes.func.isRequired,
    onToggleBatchEdit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allowMultiUpload: true,
    currentValues: {},
    hasMultipleFiles: false,
    getNode: noop,
    initialValues: {},
    isFormDirty: undefined,
    isFormPristine: undefined,
    isFormValid: undefined,
    isOpen: false,
    onClose: noop,
  };

  constructor(props) {
    super(props);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleToggleUploader() {
    const {
      isFormDirty,
      onToggleBatchEdit,
    } = this.props;


    if (isFormDirty) {
      const confirmText = 'Do you want to leave the form without saving?';
      BatchEdit.confirmDone(confirmText).then(({ value }) => {
        if (value) {
          onToggleBatchEdit();
        } else {
          // do nothing, user declined
        }
      });
    } else {
      onToggleBatchEdit();
    }
  }

  handleUpdate() {
    const {
      assetIds,
      currentValues,
      onHandleUpdate,
      onToggleBatchEdit,
    } = this.props;

    onHandleUpdate(currentValues, assetIds, onToggleBatchEdit);
  }

  render() {
    const {
      assetIds,
      nodeRef,
      currentValues,
      getFormName,
      getNode,
      isFormDirty,
      isFormValid,
      isFormPristine,
      isOpen,
      onHandleReset,
    } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={this.handleToggleUploader} size="md">
        <ModalHeader toggle={this.handleToggleUploader}>
          Batch Edit
        </ModalHeader>
        <ModalBody>
          <Card>
            <Form
              assetIds={assetIds}
              key={getFormName()}
              form={getFormName()}
              currentValues={currentValues}
              initialValues={{}}
              getNode={getNode}
              nodeRef={nodeRef}
            />
          </Card>
          <p style={{ textAlign: 'right', marginTop: '1em' }}>Note: Only edited fields are updated.</p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onHandleReset}
            disabled={!isFormDirty && !isFormPristine}
          >
            Reset
          </Button>

          <Button
            onClick={this.handleUpdate}
            disabled={isFormValid && !isFormDirty && !isFormPristine}
          >
            Update
          </Button>

          <Button
            onClick={() => this.handleToggleUploader()}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(
  selector,
  delegate,
)(BatchEdit);
