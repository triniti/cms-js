import React, { useCallback, useState } from 'react';
import prependHttp from 'prepend-http';
import isValidUrl from '@gdbots/pbj/utils/isValidUrl';
import { Button, Form, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SwitchField } from 'components';

export default function LinkModal(props) {
  const { isOpen, onAddLink, onRemoveLink, openInNewTab, toggle, url } = props;

  const [editMode, setEditMode] = useState(!!url);
  const [isValid, setIsValid] = useState(true);
  const [newTab, setNewTab] = useState(openInNewTab);
  const [value, setValue] = useState(url || '');

  const inputRef = useCallback(node => {
    if (node !== null) {
      setTimeout(() => {
        node.focus();
      });
    }
  }, []);

  const handleChange = ({ target: { value } }) => {
    setIsValid(isValidUrl(prependHttp(value, { https: true })))
    setValue(value);
  };

  const handleAddLink = () => {
    const url = prependHttp(value, { https: true });
    if (isValidUrl(url)) {
      const target = newTab ? '_blank' : null;
      onAddLink(target, url);
      toggle();
    } else {
      setIsValid(false);
    }
  };

  const handleRemoveLink = () => {
    onRemoveLink();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{`${editMode ? 'Update' : 'Add'} Link`}</ModalHeader>
      <ModalBody>
        <Form>
          <div className="form-group">
            <Input
              type="textarea"
              placeholder="Enter a new link..."
              value={value}
              onChange={handleChange}
              innerRef={inputRef}
            />
            {!isValid && <p className="text-danger">please enter a valid link</p>}
          </div>
          <SwitchField
            name="open_in_new_tab"
            label="Open in new tab?"
            checked={newTab}
            onChange={(e) => setNewTab(e.target.checked)}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        {editMode && <Button onClick={handleRemoveLink}>Remove Link</Button>}
        <Button onClick={toggle}>Cancel</Button>
        <Button onClick={handleAddLink}>{editMode ? 'Update' : 'Add'}</Button>
      </ModalFooter>
    </Modal>
  );
}
