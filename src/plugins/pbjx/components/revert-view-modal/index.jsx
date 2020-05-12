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

class RevertViewer extends React.Component {

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
    isOpen: PropTypes.bool,
    formName: PropTypes.string.isRequired,
    onRevert: PropTypes.func.isRequired,
    onToggleRevertViewer: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    }

    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleRevertSwal = this.handleRevertSwal.bind(this);
  }

  handleChangeCheckbox({ target: { id, checked, value } }) {
    const { selected } = this.state;
    if (checked) {
      selected.push({ id, value });
      this.setState({ selected });
    } else {
      this.setState({ selected: selected.filter(({id: itemId}) => itemId !== id) });
    }    
  }

  handleRevertSwal() {
    const { formName, onRevert: handleRevert, onToggleRevertViewer: handleToggleRevertViewer, } = this.props;
    const { selected } = this.state;
    handleRevert(formName, selected);
    RevertViewer.revertComplete().then(() => {
      handleToggleRevertViewer();
    });
  }

  render() {
    const {
      event,
      isOpen,
      onToggleRevertViewer: handleToggleRevertViewer,
    } = this.props;
    const { selected } = this.state;

    return (
      <Modal centered isOpen={isOpen} toggle={handleToggleRevertViewer} size="xl">
        <ModalHeader toggle={handleToggleRevertViewer}>Revert Fields</ModalHeader>
        <ModalBody className="p-0 modal-body-break">
          <ScrollableContainer className="bg-gray-400" style={{ height: 'calc(100vh - 200px)' }}>
            <RevertDetails event={event} onChangeCheckbox={this.handleChangeCheckbox} />
          </ScrollableContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleToggleRevertViewer}
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

export default RevertViewer;
