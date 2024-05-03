import React, { useState } from 'react';
import { ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SchemaCurie from '@gdbots/pbj/SchemaCurie';
import useCuries from 'plugins/pbjx/components/useCuries';
import { ActionButton, withPbj } from '@triniti/cms/components/index.js';
import usePolicy from 'plugins/iam/components/usePolicy';
import CreateWidgetForm from 'plugins/curator/components/create-widget-modal/CreateWidgetForm';

export default function CreateWidgetModal(props) {
  const policy = usePolicy();
  const [curie, setCurie] = useState();
  const widgetCuries = useCuries('triniti:curator:mixin:widget:v1');
  if (!widgetCuries) {
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
    <Modal isOpen backdrop="static">
      {!curie && (
        <>
          <ModalHeader toggle={props.toggle}>Create Widget</ModalHeader>
          <ModalBody className="modal-scrollable">
            <ListGroup>
              {widgetCuries.map(str => {
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
              }
              )}
            </ListGroup>
          </ModalBody>

          <ModalFooter>
            <ActionButton
              text="Cancel"
              onClick={props.toggle}
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
