import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import isValidUrl from '@gdbots/pbj/utils/isValidUrl.js';
import {
  Form,
  FormText,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';

export default function LinkModal(props) {
  const [editor] = useLexicalComposerContext();
  const { selectedLink } = props;
  const [url, setUrl] = useState(selectedLink && selectedLink.url);
  const [target, setTarget] = useState(selectedLink && selectedLink.target);
  const [isValid, setIsValid] = useState(!url || isValidUrl(url));
  const isNew = !selectedLink;

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    const payload = { url, target, rel: 'noreferrer' };
    if (target === '_blank') {
      payload.rel = 'noopener noreferrer';
    }
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, payload);
    props.toggle();
  };

  const handleRemove = (event) => {
    event.preventDefault();
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    props.toggle();
  };

  return (
    <Modal isOpen backdrop="static" centered>
      <ModalHeader toggle={props.toggle}>{isNew ? 'Add Link' : 'Update Link'}</ModalHeader>
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleUpdate} autoComplete="off">
          <div className="form-group">
            <Label htmlFor="link-url">URL</Label>
            <InputGroup>
              <InputGroupText className="px-2 text-black-50">
                <Icon imgSrc="link" size="sd" />
              </InputGroupText>
              <input
                id="link-url"
                name="url"
                className={`form-control ${isValid ? 'is-valid' : 'is-invalid'}`}
                type="url"
                value={url}
                onChange={event => setUrl(event.target.value)}
                onBlur={() => setIsValid(isValidUrl(url))}
              />
            </InputGroup>
            {!isValid && <FormText color="danger">Please enter a valid URL.</FormText>}
          </div>

          <div className="form-check">
            <input
              id="link-target"
              name="target"
              className="form-check-input"
              type="checkbox"
              checked={target === '_blank'}
              onChange={event => setTarget(event.target.checked ? '_blank' : null)}
            />
            <Label className="form-check-label" htmlFor="link-target">Open in new tab?</Label>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Close"
          onClick={props.toggle}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
        {!isNew && (
          <ActionButton
            text="Remove Link"
            onClick={handleRemove}
            icon="unlink"
            color="danger"
            tabIndex="-1"
          />
        )}
        <ActionButton
          text={isNew ? 'Add Link' : 'Update Link'}
          onClick={handleUpdate}
          disabled={!isValid}
          icon="link"
          color="primary"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}
