import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Footer from 'components/blocksmith-field/components/article-block-modal/Footer';
import Header from 'components/blocksmith-field/components/article-block-modal/Header';
import CustomizeOptions from 'components/blocksmith-field/components/article-block-modal/CustomizeOptions';
import SelectArticle from 'components/blocksmith-field/components/article-block-modal/SelectArticle';

export default function ArticleBlockModal(props) {
  const { block, isFreshBlock, isOpen, node, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [activeStep, setActiveStep] = useState(block.has('node_ref') ? 1 : 0);
  const [aside, setAside] = useState(block.get('aside', false));
  const [ctaText, setCtaText] = useState(block.get('cta_text', ''));
  const [linkText, setLinkText] = useState(block.get('link_text', ''));
  const [selectedArticleNode, setSelectedArticleNode] = useState(null);
  const [selectedArticleNodeRef, setSelectedArticleNodeRef] = useState(block.get('node_ref', null));
  const [selectedImageRef, setSelectedImageRef] = useState(block.get('image_ref', null));
  const [showImage, setShowImage] = useState(block.get('show_image', true));

  const setBlock = () => {
    return block
      .set('node_ref', selectedArticleNodeRef ? selectedArticleNodeRef : NodeRef.fromNode(selectedArticleNode))
      .set('show_image', showImage)
      .set('aside', aside)
      .set('cta_text', ctaText)
      .set('link_text', linkText)
      .set('image_ref', selectedImageRef);
  }

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xxl"
      // keyboard={!isImageAssetPickerModalOpen}
    >
      <Header
        activeStep={activeStep}
        isFreshBlock={isFreshBlock}
        toggle={toggle}
      />
      <div className="modal-scrollable">
        <ModalBody className="p-0">
          {activeStep === 0 && (
            <SelectArticle
              selectedArticleNode={selectedArticleNode}
              setSelectedArticleNode={setSelectedArticleNode}
            />
          )}
          {activeStep === 1 && (
            <CustomizeOptions
              aside={aside}
              setAside={setAside}
              ctaText={ctaText}
              setCtaText={setCtaText}
              linkText={linkText}
              selectedArticleNode={selectedArticleNode}
              selectedArticleNodeRef={selectedArticleNodeRef}
              selectedImageRef={selectedImageRef}
              setImageRef={setSelectedImageRef}
              setLinkText={setLinkText}
              showImage={showImage}
              setShowImage={setShowImage}
            />
          )}
        </ModalBody>
      </div>
      <Footer
        activeStep={activeStep}
        node={node}
        // onCloseUploader={this.handleCloseUploader}
        toggle={toggle}
        onDecrementStep={() => setActiveStep(activeStep - 1)}
        onIncrementStep={() => setActiveStep(activeStep + 1)}
        isNextButtonDisabled={(activeStep === 0 && !selectedArticleNode) || activeStep === 1}
        onAddBlock={() => {
          handleAddBlock(setBlock());
          toggle();
        }}
        onEditBlock={() => {
          handleEditBlock(setBlock());
          toggle();
        }}
        isFreshBlock={isFreshBlock}
      />
    </Modal>
  );
}
