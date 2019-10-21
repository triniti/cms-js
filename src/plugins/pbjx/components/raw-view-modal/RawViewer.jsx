import PropTypes from 'prop-types';
import React from 'react';
import RawContent from '@triniti/cms/components/raw-content';
import Message from '@gdbots/pbj/Message';
import {
  Modal,
  ModalHeader,
  ModalBody,
} from '@triniti/admin-ui-plugin/components';

class RawViewer extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(Message).isRequired,
    isOpen: PropTypes.bool,
    onToggleRawViewer: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  constructor(props) {
    super(props);

    this.handleToggleRawViewer = this.handleToggleRawViewer.bind(this);
  }

  handleToggleRawViewer() {
    const { onToggleRawViewer } = this.props;

    onToggleRawViewer();
  }

  render() {
    const {
      event,
      isOpen,
    } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} toggle={() => this.handleToggleRawViewer()} size="lg">
          <ModalHeader toggle={() => this.handleToggleRawViewer()}>Raw</ModalHeader>
          <ModalBody className="p-0">
            <RawContent pbj={event} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default RawViewer;
