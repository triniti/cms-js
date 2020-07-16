import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';
import Message from '@gdbots/pbj/Message';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';
import RevertDetails from './RevertDetails';
import filterRemoved from '../../utils/filterRemoved';

class RevertModal extends React.Component {
  static async revertComplete() {
    return swal.fire({
      title: 'Revert complete!',
      text: 'Please double check changes before saving work.',
      icon: 'success',
      confirmButtonText: 'Ok!',
      confirmButtonClass: 'btn btn-primary',
      reverseButtons: true,
    });
  }

  static propTypes = {
    event: PropTypes.instanceOf(Message).isRequired,
    isDbValueSameAsNodeValue: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    onRevert: PropTypes.func.isRequired,
    onToggleRevertModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };

    this.isFieldSelected = this.isFieldSelected.bind(this);
    this.handleSelectField = this.handleSelectField.bind(this);
    this.handleRevertSwal = this.handleRevertSwal.bind(this);
  }

  isFieldSelected(id) {
    const { selected } = this.state;
    let found = false;
    selected.forEach((item) => {
      const { id: itemId } = item;
      if (!found && id === itemId) {
        found = true;
      }
    });
    return found;
  }

  handleSelectField(id, value, checked) {
    const { selected } = this.state;
    if (checked) {
      selected.push({ id, value: filterRemoved(value) });
      this.setState({ selected });
    } else {
      this.setState({ selected: selected.filter(({ id: itemId }) => itemId !== id) });
    }
  }

  handleRevertSwal() {
    const { onRevert: handleRevert, onToggleRevertModal: handleToggleRevertModal } = this.props;
    const { selected } = this.state;
    handleRevert(selected);
    RevertModal.revertComplete().then(() => {
      handleToggleRevertModal();
    });
  }

  render() {
    const {
      event,
      isDbValueSameAsNodeValue,
      isOpen,
      onToggleRevertModal: handleToggleRevertModal,
    } = this.props;
    const { selected } = this.state;

    return (
      <Modal centered isOpen={isOpen} toggle={handleToggleRevertModal} size="xl">
        <ModalHeader toggle={handleToggleRevertModal}>Revert Fields</ModalHeader>
        <ModalBody className="p-0 modal-body-break">
          <ScrollableContainer className="bg-gray-400" style={{ height: 'calc(100vh - 200px)' }}>
            <RevertDetails event={event} onSelectField={this.handleSelectField} isDbValueSameAsNodeValue={isDbValueSameAsNodeValue} isFieldSelected={this.isFieldSelected} />
          </ScrollableContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleToggleRevertModal}
          >
            Cancel
          </Button>
          <Button
            onClick={this.handleRevertSwal}
            disabled={selected.length < 1}
          >
            Apply
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RevertModal;
