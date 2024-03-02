import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import RevertModal from 'plugins/ncr/components/revert-modal';
import Message from '@gdbots/pbj/Message';

const RevertButton = ({
  event,
  isDbValueSameAsNodeValue,
  isFormDirty,
  onRevert: handleRevert,
  ...btnProps
  }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleRevertModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return ([
    <Button
      key="a"
      color="light"
      size="sm"
      radius="round"
      className="mr-2"
      onClick={handleToggleRevertModal} {...btnProps}>Revert</Button>,
    isModalOpen
    && (
      <RevertModal
        key="b"
        isDbValueSameAsNodeValue={isDbValueSameAsNodeValue}
        isFormDirty={isFormDirty}
        isOpen={isModalOpen}
        event={event}
        onRevert={handleRevert}
        onToggleRevertModal={handleToggleRevertModal}
      />
    ),
  ]);
}

RevertButton.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
  isDbValueSameAsNodeValue: PropTypes.func.isRequired,
  isFormDirty: PropTypes.bool.isRequired,
  onRevert: PropTypes.func.isRequired,
};

export default RevertButton;
