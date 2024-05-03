/* eslint-disable react/no-did-update-set-state */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Badge, Button, Modal, ModalBody } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import joinCollaboration from 'plugins/raven/actions/joinCollaboration';
import leaveCollaboration from 'plugins/raven/actions/leaveCollaboration';
import selector from 'plugins/raven/components/active-edits-notification-modal/selector';
import 'plugins/raven/components/active-edits-notification-modal/styles.scss';

const ActiveEditNotificationModal = ({
  activeUserNames,
  nodeRef,
}) => {
  const shouldShowImmediately = activeUserNames.length > 0;
  const [ ready, setReady ] = useState(shouldShowImmediately);
  const [ isOpen, setIsOpen ] = useState(shouldShowImmediately);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  if (!shouldShowImmediately) {
    setTimeout(() => setReady(true), 3000);
  }

  useEffect(() => {
    setIsOpen(activeUserNames.length > 0);
  }, [ready]);

  const handleCancel = () => {
    handleContinueInViewMode(nodeRef);
    handleToggle();
    navigate(-1);
  }

  const handleContinueInViewMode = () => {
    const path = location.pathname;
    const viewModeLocation = path.substring(0, path.lastIndexOf('/edit'));

    dispatch(leaveCollaboration(nodeRef));
    handleToggle();
    navigate(viewModeLocation);
  }

  const handleContinueInEditMode = () => {
    handleToggle();
    dispatch(joinCollaboration(nodeRef));
  }

  const handleToggle = () => setIsOpen(!isOpen);


  if (!ready) {
    return null;
  }

  return (
    <Modal
      centered
      size="sd"
      isOpen={isOpen}
      keyboard={false}
      toggle={handleToggle}
      modalClassName="animate-center"
      backdrop="static"
    >
      <ModalBody className="text-center modal-wrapper">
        <Icon imgSrc="notification" alert size="lg" color="warning" border className="icon-modal" />
        <h2>Stop!</h2>
        <p className="text-modal">This {NodeRef.fromString(nodeRef).getLabel()} is being edited by:</p>
        {activeUserNames.length
          ? activeUserNames.map((userName) => (
            <h4 key={userName}>
              <Badge radius="round" color="light">{userName}</Badge>
            </h4>
          ))
          : (
            <h4>
              <Badge radius="round" color="light">Unknown User</Badge>
            </h4>
          )}
        <div className="modal-actions">
          <Button block outline color="primary" onClick={handleContinueInViewMode} className="btn-modal">
            Continue in View Mode
          </Button>
          <Button block outline color="danger" onClick={handleContinueInEditMode} className="btn-modal">
            {activeUserNames.length
              ? 'Continue in Edit Mode (tell others you are in here)'
              : 'Continue in Edit Mode (you risk overwriting another user’s work)'}
          </Button>
          <Button block outline color="secondary" onClick={handleCancel} className="btn-modal">
            Cancel and Wait
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default connect(selector)(ActiveEditNotificationModal);
