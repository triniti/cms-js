import React, { useState } from 'react';
import swal from 'sweetalert2';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import RevertDetails from 'src/plugins/ncr/components/node-history-card-wip/revert-modal/RevertDetails.js';
import filterRemoved from 'src/plugins/ncr/components/node-history-card-wip/filterRemoved.js';

const revertComplete =  async () => {
  return swal.fire({
    title: 'Revert complete!',
    text: 'Please double check changes before saving work.',
    icon: 'success',
    confirmButtonText: 'Ok!',
    confirmButtonClass: 'btn btn-primary',
    reverseButtons: true,
  });
};

const RevertModal = ({
  event,
  isDbValueSameAsNodeValue,
  isFormDirty,
  isOpen = false,
  onRevert: handleRevert,
  onToggleRevertModal: handleToggleRevertModal,
}) => {

  const [ selected, setSelected ] = useState([]);

  const handleSelectField = (id, value, checked) => {
    if (checked) {
      selected.push({ id, value: filterRemoved(value) });
      setSelected([...selected]);
    } else {
      setSelected([...selected.filter(({ id: itemId }) => itemId !== id)]);
    }
  }

  const handleRevertSwal = () => {
    handleRevert(selected);
    revertComplete().then(handleToggleRevertModal);
  }

  return (
    <Modal centered isOpen={isOpen} toggle={handleToggleRevertModal} size="xl">
      <ModalHeader toggle={handleToggleRevertModal}>Revert Fields</ModalHeader>
      <ModalBody className="p-0 modal-body-break">
        <div className="bg-gray-400" style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <RevertDetails
            event={event}
            isDbValueSameAsNodeValue={isDbValueSameAsNodeValue}
            onSelectField={handleSelectField}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        {isFormDirty && (
          <span className="text-danger">
            Please save your changes before attempting revert.
          </span>
        )}
        <Button
          onClick={handleToggleRevertModal}
        >
          Cancel
        </Button>
        <Button
          onClick={handleRevertSwal}
          disabled={isFormDirty || selected.length < 1}
        >
          Apply
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default RevertModal;
