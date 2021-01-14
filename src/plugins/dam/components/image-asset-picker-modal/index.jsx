import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import noop from 'lodash/noop';

import Message from '@gdbots/pbj/Message';
import Uploader from '@triniti/cms/plugins/dam/components/uploader';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  ScrollableContainer,
  TabContent,
  TabPane,
} from '@triniti/admin-ui-plugin/components';
import ImageSearch from '@triniti/cms/plugins/dam/components/image-search';
import LinkedImages from '@triniti/cms/plugins/dam/components/linked-images';
import GalleryImages from '@triniti/cms/plugins/curator/components/gallery-images';

class ImageAssetPickerModal extends React.Component {
  static propTypes = {
    areLinkedImagesAllowed: PropTypes.bool,
    assetTypes: PropTypes.arrayOf(PropTypes.string),
    galleryNode: PropTypes.instanceOf(Message),
    isOpen: PropTypes.bool,
    label: PropTypes.string,
    modalTitle: PropTypes.string,
    multiAssetErrorMessage: PropTypes.string,
    node: PropTypes.instanceOf(Message),
    onCloseUploader: PropTypes.func,
    onSelectImage: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
    selectedImage: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    areLinkedImagesAllowed: true,
    assetTypes: [],
    galleryNode: null,
    isOpen: false,
    label: 'Select Primary Image',
    modalTitle: '',
    multiAssetErrorMessage: 'Invalid Action: Trying to assign multiple files as a Primary Media.',
    node: null,
    onCloseUploader: noop,
    selectedImage: null,
  };

  constructor(props) {
    super(props);
    const { areLinkedImagesAllowed, node } = props;
    let activeTab = node ? 'linked-media' : 'search-media';
    if (!areLinkedImagesAllowed) {
      activeTab = 'search-media';
    }
    this.state = {
      activeTab,
      isUploaderOpen: false,
      refreshSearch: 0,
    };
    this.handleSwitchTabs = this.handleSwitchTabs.bind(this);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
    this.handleOpened = this.handleOpened.bind(this);
  }

  handleSwitchTabs(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      }, () => {
        const input = tab === 'search-media' ? this.searchInput : this.galleryImagesSearchInput;
        if (input) { // no input to focus on for linked tab
          input.focus();
        }
      });
    }
  }

  handleOpened() {
    const { activeTab } = this.state;
    if (activeTab === 'search-media') {
      this.searchInput.focus();
    }
  }

  handleToggleUploader(asset, toggleAllModals) {
    this.setState(({ isUploaderOpen, refreshSearch }) => ({
      isUploaderOpen: !isUploaderOpen,
      refreshSearch: (isUploaderOpen && asset) ? 1 - refreshSearch : refreshSearch,
    }), () => {
      const { isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        const { onCloseUploader } = this.props;
        const { activeTab } = this.state;
        onCloseUploader(asset, toggleAllModals);
        if (activeTab === 'search-media') {
          this.searchInput.focus();
        } else {
          this.cancelBtn.focus();
        }
      }
    });
  }

  render() {
    const {
      areLinkedImagesAllowed,
      assetTypes,
      galleryNode,
      isOpen,
      label,
      modalTitle,
      multiAssetErrorMessage,
      node,
      onSelectImage,
      onToggleModal,
      selectedImage,
    } = this.props;
    const { activeTab, isUploaderOpen, refreshSearch } = this.state;

    return (
      <div>
        <Modal onOpened={this.handleOpened} centered size="xxl" isOpen={isOpen} toggle={onToggleModal}>
          <ModalHeader toggle={onToggleModal}>
            <span className="nowrap">{modalTitle !== '' ? modalTitle : label}</span>
          </ModalHeader>
          <ModalBody className="p-0">
            {
              areLinkedImagesAllowed
              && (
                <Nav underline>
                  {
                    node
                    && (
                      <NavItem>
                        <div
                          className={classNames('nav-link tabindex', { active: activeTab === 'linked-media' })}
                          onClick={() => this.handleSwitchTabs('linked-media')}
                          role="presentation"
                        >
                          Linked Media
                        </div>
                      </NavItem>
                    )
                  }
                  <NavItem>
                    <div
                      className={classNames('nav-link tabindex', { active: activeTab === 'search-media' })}
                      onClick={() => this.handleSwitchTabs('search-media')}
                      role="presentation"
                    >
                      Search Media
                    </div>
                  </NavItem>
                  {
                    galleryNode
                    && (
                      <NavItem>
                        <div
                          className={classNames('nav-link tabindex', { active: activeTab === 'gallery-images' })}
                          onClick={() => this.handleSwitchTabs('gallery-images')}
                          role="presentation"
                        >
                          Gallery Images
                        </div>
                      </NavItem>
                    )
                  }
                </Nav>
              )
            }
            <TabContent activeTab={activeTab}>
              {
                node
                && (
                  <TabPane tabId="linked-media">
                    <ScrollableContainer className="bg-gray-400" style={{ height: 'calc(100vh - 224px)' }}>
                      <LinkedImages
                        node={node}
                        onSelectImage={onSelectImage}
                        onSwitchTabs={this.handleSwitchTabs}
                        onToggleUploader={this.handleToggleUploader}
                        refreshSearch={refreshSearch}
                      />
                    </ScrollableContainer>
                  </TabPane>
                )
              }
              <TabPane tabId="search-media">
                <ImageSearch
                  assetTypes={assetTypes}
                  heightOffset="268"
                  innerRef={(el) => { this.searchInput = el; }}
                  onSelectImage={onSelectImage}
                  onToggleUploader={this.handleToggleUploader}
                  refreshSearch={refreshSearch}
                  selectedImages={selectedImage ? [selectedImage] : []}
                />
              </TabPane>
              {
                galleryNode
                && (
                  <TabPane tabId="gallery-images">
                    <ScrollableContainer className="bg-gray-400" style={{ height: 'calc(100vh - 224px)' }}>
                      <GalleryImages
                        galleryNode={galleryNode}
                        onSelectImage={onSelectImage}
                        onToggleUploader={this.handleToggleUploader}
                        selectedImage={selectedImage}
                        innerRef={(el) => { this.galleryImagesSearchInput = el; }}
                      />
                    </ScrollableContainer>
                  </TabPane>
                )
              }
            </TabContent>
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-auto"
              color="primary"
              onClick={this.handleToggleUploader}
            >
              Upload
            </Button>
            <Button
              onClick={onToggleModal}
              innerRef={(el) => { this.cancelBtn = el; }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {
          isUploaderOpen && (
            <Uploader
              allowMultiUpload={false}
              isOpen={isUploaderOpen}
              linkedRefs={node ? [NodeRef.fromNode(node)] : []}
              multiAssetErrorMessage={multiAssetErrorMessage}
              onToggleUploader={this.handleToggleUploader}
            />
          )
        }
      </div>
    );
  }
}

export default ImageAssetPickerModal;
