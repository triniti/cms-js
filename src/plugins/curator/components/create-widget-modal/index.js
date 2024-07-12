import React, { useState } from 'react';
import { ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SchemaCurie from '@gdbots/pbj/SchemaCurie.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import { ActionButton, withPbj } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import CreateWidgetForm from '@triniti/cms/plugins/curator/components/create-widget-modal/CreateWidgetForm.js';

export default function CreateWidgetModal(props) {
  const policy = usePolicy();
  const [curie, setCurie] = useState();
  const curies = useCuries('triniti:curator:mixin:widget:v1');
  if (!curies) {
    return null;
  }

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setCurie(event.target.dataset.curie);
  };

  const handleGoBack = () => setCurie(null);

  const ComponentWithPbj = curie && withPbj(CreateWidgetForm, curie);

  return (
    <Modal isOpen centered backdrop="static">
      {!curie && (
        <>
          <ModalHeader toggle={props.toggle}>Create Widget</ModalHeader>
          <ModalBody className="modal-scrollable">
            <ListGroup>
              {curies.map(str => {
                const curie = SchemaCurie.fromString(str);
                const canCreate = policy.isGranted(`${curie.getQName()}:create`);
                if (!canCreate) {
                  return;
                }

                return (
                  <ListGroupItem key={curie.toString()}>
                    <a
                      className="text-info"
                      data-curie={curie.toString()}
                      onClick={handleClick}
                    >{curie.getMessage()}</a>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </ModalBody>

          <ModalFooter>
            <ActionButton
              text="Cancel"
              onClick={props.toggle}
              icon="close-sm"
              color="light"
              tabIndex="-1"
            />
          </ModalFooter>
        </>
      )}
      {curie && <ComponentWithPbj editMode toggle={props.toggle} onGoBack={handleGoBack} />}
    </Modal>
  );
}
