import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import startCase from 'lodash-es/startCase.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { Badge, Button, Modal, ModalBody } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import getStatus from '@triniti/cms/plugins/raven/selectors/getStatus.js';
import { connectionStatus } from '@triniti/cms/plugins/raven/constants.js';

function UserName(props) {
  const { nodeRef } = props;
  const { node } = useNode(nodeRef);
  let title = 'UNKNOWN';
  if (node) {
    title = node.get('title') || `${node.get('first_name', '')} ${node.get('last_name', '')}`;
  }

  return (
    <h4>
      <Badge radius="round" color="light">{title}</Badge>
    </h4>
  );
}

export default function WarningModal(props) {
  const { nodeRef, users, viewModeUrl } = props;
  const navigate = useNavigate();
  const myUserRef = useSelector(getUserRef);
  const status = useSelector(getStatus);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const shouldBeShown = () => {
    if (hasBeenShown) {
      return false;
    }

    const includesMe = !!users[myUserRef];
    const userRefs = Object.keys(users);
    const totalUsers = includesMe ? userRefs.length - 1 : userRefs.length;
    return totalUsers > 0;
  };

  useEffect(() => {
    if (hasBeenShown || status !== connectionStatus.CONNECTED) {
      return;
    }

    if (shouldBeShown()) {
      setShowWarning(true);
    }
  }, [hasBeenShown, status]);

  useEffect(() => {
    if (shouldBeShown()) {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) {
    return null;
  }

  const handleContinueInEditMode = () => {
    setHasBeenShown(true);
    setShowWarning(false);
  };

  const handleContinueInViewMode = () => {
    setHasBeenShown(true);
    setShowWarning(false);
    navigate(viewModeUrl);
  };

  const type = startCase(NodeRef.fromString(nodeRef).getLabel()).toLowerCase();

  return (
    <Modal keyboard={false} isOpen size="sd" backdrop="static" centered modalClassName="animate-center">
      <ModalBody className="text-center">
        <Icon imgSrc="notification" alert size="lg" color="warning" border className="icon-modal" />
        <h2>Stop!</h2>
        <p className="text-modal">This {type} is being edited by:</p>
        {Object.keys(users).map((ref) => <UserName key={ref} nodeRef={ref} ts={users[ref]} />)}
        <div className="modal-actions">
          <Button block color="primary" onClick={handleContinueInViewMode} className="btn-modal">
            Continue in View Mode
          </Button>
          <Button block color="danger" onClick={handleContinueInEditMode} className="btn-modal">
            Continue in Edit Mode (tell others you are in here)
          </Button>
          <Button block color="secondary" onClick={handleContinueInViewMode} className="btn-modal">
            Cancel and Wait
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
