import React from 'react';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { SwitchField, TextField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';

export default function CustomizeOptions(props) {
  const {
    aside,
    setAside,
    ctaText,
    linkText,
    selectedArticleNode,
    selectedArticleNodeRef,
    selectedImageRef,
    setImageRef,
    setLinkText,
    setCtaText,
    showImage,
    setShowImage
  } = props;

  const nodeRef = selectedArticleNodeRef ?
    selectedArticleNodeRef.toString() : NodeRef.fromNode(selectedArticleNode).toString();

  return (
    <div className="container-lg p-5">
      <ImagePickerField
        label="Image"
        nodeRef={nodeRef}
        onSelectImage={setImageRef}
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
      />
      <TextField
        name="cta_text"
        label="Call to action"
        value={ctaText}
        onChange={(e) => setCtaText(e.target.value)}
      />
    </div>
  );
}
