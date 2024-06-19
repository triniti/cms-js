import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane
} from 'reactstrap';
import { ActionButton } from '@triniti/cms/components/index.js';
import GalleryImages from '@triniti/cms/plugins/dam/components/asset-picker-field/GalleryImages.js';
import LinkedImages from '@triniti/cms/plugins/dam/components/asset-picker-field/LinkedImages.js';
import SearchAssets from '@triniti/cms/plugins/dam/components/asset-picker-field/SearchAssets.js';
import UploaderButton from '@triniti/cms/plugins/dam/components/uploader-button/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import noop from 'lodash-es/noop.js';

export default function AssetPickerModal({
  assetType,
  assetRef,
  nodeRef,
  selectAsset,
  toggle,
  onUploadedAssetComplete = noop,
  searchQ,
  headerTitle = 'Select an Image',
}) {
  const isGallery = nodeRef && nodeRef.includes('gallery');
  const allowLinked = (assetRef && nodeRef.includes('article')) || isGallery;
  const tab = allowLinked ? 'linked-images' : 'search-images'
  const [ activeTab, setActiveTab ] = useState(tab);

  const selectActiveTab = (tab) => {
    setActiveTab(tab);
  }

  const handleUploadedAssetComplete = (assets) => {
    onUploadedAssetComplete(assets);
    //toggle();
  };

  return (
    <Modal isOpen backdrop="static" size="xxl" centered>
      <ModalHeader toggle={toggle}>{headerTitle}</ModalHeader>
      <ModalBody className="p-0">
        {allowLinked && (
          <Nav className="nav-underline">
            {assetRef && (
              <NavItem active={'linked-images' === activeTab}>
                <div
                  className={'linked-images' === activeTab ? 'nav-link active' : 'nav-link'}
                  onClick={() => selectActiveTab('linked-images')}
                >
                  Linked Images
                </div>
              </NavItem>
            )}
            <NavItem active={'search-images' === activeTab}>
              <div
                className={'search-images' === activeTab ? 'nav-link active' : 'nav-link'}
                onClick={() => selectActiveTab('search-images')}
              >
                Search Images
              </div>
            </NavItem>
            {isGallery && (
              <NavItem active={'gallery-images' === activeTab}>
                <div
                  className={'gallery-images' === activeTab ? 'nav-link active' : 'nav-link'}
                  onClick={() => selectActiveTab('gallery-images')}
                >
                  Gallery Images
                </div>
              </NavItem>
            )}
          </Nav>
        )}

        <TabContent activeTab={activeTab}>
          <TabPane tabId="search-images">
            <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
              <SearchAssets
                assetType={assetType}
                selectAsset={selectAsset}
                toggle={toggle}
                searchQ={searchQ}
              />
            </div>
          </TabPane>
          <TabPane tabId="linked-images">
            <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
              <LinkedImages
                nodeRef={nodeRef}
                selectActiveTab={selectActiveTab}
                selectImage={selectAsset}
                toggle={toggle}
                onUploadedAssetComplete={handleUploadedAssetComplete}
              />
            </div>
          </TabPane>
          <TabPane tabId="gallery-images">
            <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
              <GalleryImages
                nodeRef={nodeRef}
                selectImage={selectAsset}
                toggle={toggle}
              />
            </div>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
      <div className="d-flex justify-content-between container-fluid">
        <div className="me-auto p-2">
          <UploaderButton
            linkedRefs={nodeRef ? [NodeRef.fromString(nodeRef)] : []}
            allowMultiUpload={false}
            onClose={handleUploadedAssetComplete}
            >
            Upload
          </UploaderButton>
        </div>
        <div className="p-2">
          <ActionButton
            text="Cancel"
            onClick={toggle}
            color="secondary"
            tabIndex="-1"
          />
        </div>
      </div>
      </ModalFooter>
    </Modal>
  );
}
