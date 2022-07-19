import React, { useState } from 'react';
import {
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import {
  ActionButton,
  DatePickerField,
  SwitchField,
  TextField,
  withForm,
  withPbj
} from 'components';

function PageBreakBlockModal(props) {
  const { block, delegate, form, handleSubmit, isFreshBlock, isOpen, onAddBlock: handleAddBlock, onEditBlock, toggle } = props;

  const [hasUpdatedDate, setHasUpdatedDate] = useState(block.has('updated_date'));
  const [readMoreText, setReadMoreText] = useState(block.get('read_more_text'));
  const [updatedDate, setUpdatedDate] = useState(block.get('updated_date', new Date()));

  delegate.handleUpdate = form.submit;
  delegate.handleSubmit = (values) => {
    if (values.updated_date) {
      handleChangeDate(values.updated_date);
    }

    if (isFreshBlock) {
      handleNewBlock();
    } else {
      handleEditBlock();
    }
  };

  const setBlock = () => {
    return block
      .set('read_more_text', readMoreText || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  };

  const handleNewBlock = () => {
    handleAddBlock(setBlock());
    toggle();
  };

  const handleEditBlock = () => {
    onEditBlock(setBlock());
    toggle();
  };

  const handleChangeDate = (date) => {
    const newDate = Date.parse(date);
    setUpdatedDate(new Date(newDate));
    setHasUpdatedDate(true);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {`${isFreshBlock ? 'Add' : 'Update'} Page Break Block`}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            name="text"
            label="Read More Text"
            placeholder="Enter the read more text here"
            value={readMoreText}
            onChange={(e) => setReadMoreText(e.target.value)}
          />
          <SwitchField
            name="is_update"
            label="Is update"
            size="sd"
            checked={hasUpdatedDate}
            onChange={(e) => setHasUpdatedDate(e.target.checked)}
            editMode
          />
          {hasUpdatedDate && (
            <DatePickerField
              name="updated_date"
              label="Updated Date"
            />
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          color="light"
          tabIndex="-1"
        />
        <ActionButton
          text={isFreshBlock ? 'Add' : 'Update'}
          onClick={delegate.handleUpdate}
          color="secondary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(PageBreakBlockModal), '*:canvas:block:page-break-block:v1');

export default function ModalWithBlock(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:block`} editMode {...props} />;
}
