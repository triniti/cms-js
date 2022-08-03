import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';
import changedTime from 'components/blocksmith-field/utils/changedTime';

export default function TextBlockModal(props) {
  const { block, isOpen, onEditBlock, toggle } = props;

  const [hasUpdatedDate, setHasUpdatedDate] = useState(block.has('updated_date'));
  const [updatedDate, setUpdatedDate] = useState(block.get('updated_date', new Date()));

  const handleEditBlock = () => {
    onEditBlock(block.set('updated_date', updatedDate));
    toggle();
  };

  const handleChangeDate = (date) => {
    const newDate = Date.parse(date);
    setUpdatedDate(new Date(newDate));
  };

  const handleChangeTime = ({ target: { value: time } }) => {
    const newTime = changedTime(time)(time).updatedDate;
    const newDate = Date.parse(newTime);
    setUpdatedDate(new Date(newDate));
  };

  const handleRemove = () => {
    setHasUpdatedDate(false);
    onEditBlock(block.clear('updated_date'));
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Update Text Block</ModalHeader>
      <div className="modal-scrollable">
        <ModalBody className="text-center">
          <DateTimePicker
            onChangeDate={handleChangeDate}
            onChangeTime={handleChangeTime}
            updatedDate={updatedDate}
            className="pt-2"
          />
        </ModalBody>
      </div>
      <ModalFooter>
        {hasUpdatedDate && (
          <Button onClick={handleRemove} color="danger">Remove</Button>
        )}
        <Button onClick={toggle} color="light">Cancel</Button>
        <Button onClick={handleEditBlock} color="success">{hasUpdatedDate ? 'Update' : 'Add'}</Button>
      </ModalFooter>
    </Modal>
  );
}
