import React, { lazy, useState } from 'react';
import startCase from 'lodash-es/startCase';
import { Badge, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SchemaCurie from '@gdbots/pbj/SchemaCurie';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort';
import { ActionButton, Loading, withPbj } from '@triniti/cms/components';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';

const components = {};
const resolveComponent = (curie) => {
  if (components[curie]) {
    return components[curie];
  }

  const file = startCase(SchemaCurie.fromString(curie).getMessage()).replace(/\s/g, '');
  components[curie] = lazy(() => import(`./${file}Modal`));
  return components[curie];
};

function CreateNotificationModal(props) {
  const policy = usePolicy();
  const { request, contentRef } = props;
  const { response, pbjxError } = useRequest(request, true);
  const [appRef, setAppRef] = useState();
  const [curie, setCurie] = useState();

  const handleAppClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAppRef(event.target.dataset.appRef);
    setCurie(event.target.dataset.curie);
  };

  const handleGoBack = () => {
    setAppRef(null);
    setCurie(null);
  }

  const ComponentWithPbj = curie && withPbj(resolveComponent(curie), curie);

  return (
    <Modal isOpen backdrop="static">
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {!curie && (
        <>
          <ModalHeader toggle={props.toggle}>Create Notification</ModalHeader>
          <ModalBody className="modal-scrollable">
            {response && response.has('nodes') && (
              <ListGroup>
                {response.get('nodes').map(node => {
                    const appCurie = node.schema().getCurie();
                    const vendor = appCurie.getVendor();
                    const label = appCurie.getMessage().replace('-app', '-notification');
                    const canCreate = policy.isGranted(`${vendor}:${label}:create`);
                    if (!canCreate) {
                      return;
                    }

                    const ref = node.generateNodeRef().toString();
                    const curie = `${vendor}:notify:node:${label}`;

                    return (
                      <a
                        key={ref}
                        className="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center"
                        data-curie={curie}
                        data-app-ref={ref}
                        onClick={handleAppClick}
                      >
                        {node.get('title')}
                        <Badge pill color="primary" className="ms-2">{appCurie.getMessage()}</Badge>
                      </a>
                    );
                  }
                )}
              </ListGroup>
            )}
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
          appRef={appRef}
          contentRef={contentRef}
          onGoBack={handleGoBack}
        />
      )}
    </Modal>
  );
}

export default withRequest(CreateNotificationModal, 'gdbots:iam:request:search-apps-request', {
  channel: 'create-notification-modal',
  initialData: {
    count: 50,
    sort: SearchAppsSort.TITLE_ASC.getValue(),
  }
});
