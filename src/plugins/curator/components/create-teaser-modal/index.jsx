import React, { lazy, useState } from 'react';
import startCase from 'lodash-es/startCase';
import { ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SchemaCurie from '@gdbots/pbj/SchemaCurie';
import useCuries from 'plugins/pbjx/components/useCuries';
import { ActionButton, withPbj } from 'components';
import usePolicy from 'plugins/iam/components/usePolicy';

const components = {};
const resolveComponent = (curie) => {
  if (components[curie]) {
    return components[curie];
  }

  const file = startCase(SchemaCurie.fromString(curie).getMessage()).replace(/\s/g,'');
  components[curie] = lazy(() => import(`./${file}Modal`));
  return components[curie];
};

export default function CreateTeaserModal(props) {
  const policy = usePolicy();
  const [curie, setCurie] = useState();
  const teaserCuries = useCuries('triniti:curator:mixin:teaser:v1');
  if (!teaserCuries) {
    return null;
  }

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setCurie(event.target.dataset.curie);
  };

  const handleGoBack = () => setCurie(null);
  const ComponentWithPbj = curie && withPbj(resolveComponent(curie), curie);

  return (
    <Modal isOpen backdrop="static">
      {!curie && (
        <>
          <ModalHeader toggle={props.toggle}>Create Teaser</ModalHeader>
          <ModalBody>
            <ListGroup>
              {teaserCuries.map(str => {
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
      {curie && (
        <ComponentWithPbj
          editMode
          toggle={props.toggle}
          onGoBack={handleGoBack}
        />
      )}
    </Modal>
  );
}
