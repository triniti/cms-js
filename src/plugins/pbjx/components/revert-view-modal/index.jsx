import PropTypes from 'prop-types';
import React from 'react';
import RevertDetails from './RevertDetails';
import Message from '@gdbots/pbj/Message';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';

class RevertViewer extends React.Component {

  static propTypes = {
    event: PropTypes.instanceOf(Message).isRequired,
    isOpen: PropTypes.bool,
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

  render() {
    const { event, isOpen, onToggleRevertViewer, } = this.props;
    const { selected } = this.state;

    return (
      <Modal centered isOpen={isOpen} toggle={onToggleRevertViewer} size="xl">
        <ModalHeader toggle={onToggleRevertViewer}>Revert Fields</ModalHeader>
        <ModalBody className="p-0 modal-body-break">
          <ScrollableContainer className="bg-gray-400" style={{ height: 'calc(100vh - 200px)' }}>
            <RevertDetails event={event} onChangeCheckbox={this.handleChangeCheckbox} />
          </ScrollableContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            // onClick={delegate.handleSave}
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
