import React, { lazy, useState } from 'react';
import startCase from 'lodash-es/startCase.js';
import { ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SchemaCurie from '@gdbots/pbj/SchemaCurie.js';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort.js';
import { ActionButton, Loading, withPbj } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';

const components = {};
const resolveComponent = (curie) => {
  if (components[curie]) {
    return components[curie];
  }

  const file = startCase(SchemaCurie.fromString(curie).getMessage()).replace(/\s/g, '');
  components[curie] = lazy(() => import(`@triniti/cms/plugins/notify/components/create-notification-modal/${file}Modal.js`));
  return components[curie];
};

function CreateNotificationModal(props) {
  const policy = usePolicy();
  const { request, contentRef } = props;
  const { response, pbjxError } = useRequest(request);
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
                    const ref = node.generateNodeRef();
                    const qname = ref.getQName();
                    const vendor = qname.getVendor();
                    const label = qname.getMessage().replace('-app', '-notification');
                    const canCreate = policy.isGranted(`${vendor}:${label}:create`);
                    if (!canCreate) {
                      return;
                    }

                    return (
                      <ListGroupItem
                        data-curie={`${vendor}:notify:node:${label}`}
                        data-app-ref={ref.toString()}
                        onClick={handleAppClick}
                        key={ref.toString()}
                        tag="a"
                        action
                        tabIndex="0"
                      >{node.get('title')}
                      </ListGroupItem>
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
              icon="close-sm"
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
  channel: 'modal',
  initialData: {
    count: 50,
    sort: SearchAppsSort.TITLE_ASC.getValue(),
  }
});
