import PropTypes from 'prop-types';
import React from 'react';
import RawContent from '@triniti/cms/components/raw-content';
import Message from '@gdbots/pbj/Message';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';

const RawViewer = ({ event, isOpen, onToggleRawViewer: handleToggleRawViewer }) => (
  <div>
    <Modal centered isOpen={isOpen} toggle={handleToggleRawViewer} size="xl">
      <ModalHeader toggle={handleToggleRawViewer}>Raw</ModalHeader>
      <ModalBody className="p-0 modal-body-break">
        <ScrollableContainer className="bg-gray-400" style={{ height: 'calc(115vh - 224px)' }}>
          <RawContent pbj={event} header="" />
        </ScrollableContainer>
      </ModalBody>
    </Modal>
  </div>
);

RawViewer.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
  isOpen: PropTypes.bool,
  onToggleRawViewer: PropTypes.func.isRequired,
};

RawViewer.defaultProps = {
  isOpen: false,
};

export default RawViewer;
