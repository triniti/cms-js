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
import { ActionButton } from 'components';
import GalleryImages from 'plugins/dam/components/image-picker-field/GalleryImages';
import LinkedImages from 'plugins/dam/components/image-picker-field/LinkedImages';
import SearchImages from 'plugins/dam/components/image-picker-field/SearchImages';

export default function ImagePickerModal(props) {
  const { imageRef, nodeRef, selectImage } = props;

  const isGallery = nodeRef && nodeRef.includes('gallery');
  const allowLinked = (imageRef && nodeRef.includes('article')) || isGallery;
  const tab = allowLinked ? 'linked-images' : 'search-images'
  const [activeTab, setActiveTab] = useState(tab);

  return (
    <Modal isOpen backdrop="static" size="xxl">
      <ModalHeader toggle={props.toggle}>Select Primary Image</ModalHeader>
      <ModalBody className="p-0">
        {allowLinked && (
          <Nav className="nav-underline">
            {imageRef && (
              <NavItem active={'linked-images' === activeTab}>
                <div
                  className={'linked-images' === activeTab ? 'nav-link active': 'nav-link'}
                  onClick={() => {setActiveTab('linked-images')}}
                >
                  Linked Images
                </div>
              </NavItem>
            )}
            <NavItem active={'search-images' === activeTab}>
              <div
                className={'search-images' === activeTab ? 'nav-link active': 'nav-link'}
                onClick={() => {setActiveTab('search-images')}}
              >
                Search Images
              </div>
            </NavItem>
            {isGallery && (
              <NavItem active={'gallery-images' === activeTab}>
                <div
                  className={'gallery-images' === activeTab ? 'nav-link active': 'nav-link'}
                  onClick={() => {setActiveTab('gallery-images')}}
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
              <SearchImages
                selectImage={selectImage}
                toggle={props.toggle}
              />
            </div>
          </TabPane>
          <TabPane tabId="linked-images">
            <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
            <LinkedImages
              nodeRef={nodeRef}
              selectImage={selectImage}
              toggle={props.toggle}
            />
            </div>
          </TabPane>
          <TabPane tabId="gallery-images">
            <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
            <GalleryImages
              nodeRef={nodeRef}
              selectImage={selectImage}
              toggle={props.toggle}
            />
            </div>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          color="secondary"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}
