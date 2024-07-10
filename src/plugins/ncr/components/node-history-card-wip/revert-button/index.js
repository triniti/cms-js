import React, { useState } from 'react';
import { Button } from 'reactstrap';
import RevertModal from 'src/plugins/ncr/components/node-history-card-wip/revert-modal/index.js';

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
      className="me-2"
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

export default RevertButton;
