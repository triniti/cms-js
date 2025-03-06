import React, { lazy, Suspense, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import noop from 'lodash-es/noop.js';
import { ActionButton, ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

const UploaderModal = lazy(() => import('@triniti/cms/plugins/dam/components/uploader-modal/index.js'));
const LinkedTab = lazy(() => import('@triniti/cms/plugins/dam/components/asset-picker-field/LinkedTab.js'));
const SearchTab = lazy(() => import('@triniti/cms/plugins/dam/components/asset-picker-field/SearchTab.js'));

export default function AssetPickerModal(props) {
  const {
    onSelectAsset = noop,
    header = 'Select Asset',
    defaultTab = 'linked',
    linkedRef,
    galleryRef,
    uploaderProps = {},
  } = props;
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(linkedRef ? defaultTab : 'search');

  const handleSelectAsset = async (ref) => {
    if (!ref) {
      if (uploaderOpen) {
        setUploaderOpen(false);
      }
      return;
    }

    await onSelectAsset(ref);
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
          <UploaderModal
            {...uploaderProps}
            linkedRef={linkedRef}
            allowMultiple={false}
            onDone={handleSelectAsset}
            toggle={handleSelectAsset}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Modal isOpen backdrop="static" size="xxl" centered>
      <ModalHeader toggle={props.toggle}>{header}</ModalHeader>
      <ModalBody className="p-0">
        {linkedRef && (
          <Nav className="nav-underline">
            <NavItem>
              <NavLink data-tab="linked" active={activeTab === 'linked'} onClick={handleClickTab}>
                Linked
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink data-tab="search" active={activeTab === 'search'} onClick={handleClickTab}>
                Search
              </NavLink>
            </NavItem>
            {galleryRef && (
              <NavItem>
                <NavLink data-tab="gallery" active={activeTab === 'gallery'} onClick={handleClickTab}>
                  Gallery
                </NavLink>
              </NavItem>
            )}
          </Nav>
        )}

        <TabContent activeTab={activeTab}>
          {linkedRef && (
            <TabPane tabId="linked">
              <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                  <LinkedTab
                    {...props}
                    activeTab={activeTab}
                    onClickTab={handleClickTab}
                    onSelectAsset={handleSelectAsset}
                    onUpload={handleUpload}
                  />
                </ErrorBoundary>
              </Suspense>
            </TabPane>
          )}
          <TabPane tabId="search">
            <Suspense fallback={<Loading />}>
              <ErrorBoundary>
                <SearchTab
                  {...props}
                  galleryRef=""
                  activeTab={activeTab}
                  onClickTab={handleClickTab}
                  onSelectAsset={handleSelectAsset}
                  onUpload={handleUpload}
                />
              </ErrorBoundary>
            </Suspense>
          </TabPane>
          <TabPane tabId="gallery">
            <Suspense fallback={<Loading />}>
              <ErrorBoundary>
                <SearchTab
                  {...props}
                  activeTab={activeTab}
                  onClickTab={handleClickTab}
                  onSelectAsset={handleSelectAsset}
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
          icon="cloud-upload"
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
