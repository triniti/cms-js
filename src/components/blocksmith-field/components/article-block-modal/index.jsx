import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Footer from 'components/blocksmith-field/components/article-block-modal/Footer';
import Header from 'components/blocksmith-field/components/article-block-modal/Header';
import SelectArticle from 'components/blocksmith-field/components/article-block-modal/SelectArticle';
import { SwitchField, TextField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';

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

  let nodeRef = null;
  if (activeStep === 1) {
    nodeRef = selectedArticleNodeRef ? selectedArticleNodeRef.toString() : NodeRef.fromNode(selectedArticleNode).toString();
  }
  

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xxl"
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
            <div className="container-lg p-5">
              <ImagePickerField
                label="Image"
                name="image_ref"
                nodeRef={nodeRef}
                onSelectImage={setSelectedImageRef}
                selectedImageRef={selectedImageRef}
              />
              <TextField
                name="link_text"
                label="Link Text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <SwitchField
                name="show_image"
                label="Show Image"
                checked={showImage}
                onChange={(e) => setShowImage(e.target.checked)}
              />
              <SwitchField
                name="aside"
                label="Aside"
                checked={aside}
                onChange={(e) => setAside(e.target.checked)}
                tooltip="Is only indirectly related to the main content."
              />
              <TextField
                name="cta_text"
                label="Call to action"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            </div>
          )}
        </ModalBody>
      </div>
      <Footer
        activeStep={activeStep}
        node={node}
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
