import React, { lazy, Suspense, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import noop from 'lodash-es/noop.js';
import startCase from 'lodash-es/startCase.js';
import { ActionButton, ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

const UploaderModal = lazy(() => import('@triniti/cms/plugins/dam/components/uploader/index.js'));
const LinkedTab = lazy(() => import('@triniti/cms/plugins/dam/components/image-picker-field/LinkedTab.js'));
const SearchTab = lazy(() => import('@triniti/cms/plugins/dam/components/image-picker-field/SearchTab.js'));

export default function ImagePickerModal(props) {
  const { onSelectImage = noop, label } = props;
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('linked');

  const handleSelectImage = async (ref) => {
    if (!ref) {
      if (uploaderOpen) {
        setUploaderOpen(false);
      }
      return;
    }

    await onSelectImage(ref);
    props.toggle();
  };

  const handleUpload = () => {
    setUploaderOpen(true);
  };

  const handleClickTab = (event) => {
    setActiveTab(event.target.dataset.tab);
  };

  if (uploaderOpen) {
    return (
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <UploaderModal {...props} onDone={handleSelectImage} toggle={handleSelectImage} />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Modal isOpen backdrop="static" size="xl" centered>
      <ModalHeader toggle={props.toggle}>Select {startCase(label)}</ModalHeader>
      <ModalBody className="p-0">
        <Nav className="nav-underline">
          <NavItem>
            <NavLink data-tab="linked" active={activeTab === 'linked'} onClick={handleClickTab}>
              Linked Images
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink data-tab="search" active={activeTab === 'search'} onClick={handleClickTab}>
              Search Images
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="linked">
            <Suspense fallback={<Loading />}>
              <ErrorBoundary>
                <LinkedTab
                  {...props}
                  activeTab={activeTab}
                  onClickTab={handleClickTab}
                  onSelectImage={handleSelectImage}
                  onUpload={handleUpload}
                />
              </ErrorBoundary>
            </Suspense>
          </TabPane>
          <TabPane tabId="search">
            <Suspense fallback={<Loading />}>
              <ErrorBoundary>
                <SearchTab
                  {...props}
                  activeTab={activeTab}
                  onClickTab={handleClickTab}
                  onSelectImage={handleSelectImage}
                  onUpload={handleUpload}
                />
              </ErrorBoundary>
            </Suspense>
          </TabPane>
        </TabContent>
      </ModalBody>

      <ModalFooter>
        <ActionButton
          text="Upload"
          onClick={handleUpload}
          color="primary"
          tabIndex="-1"
        />

        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}
