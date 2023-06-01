import React from 'react';
import { SwitchField, TextField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import NodeRef from "@gdbots/pbj/well-known/NodeRef";

export default function CustomizeOptions(props) {
  const {
    aside,
    setAside,
    launchText,
    setLaunchText,
    selectedAudioNode,
    selectedAudioRef,
    selectedImageRef,
    setImageRef
  } = props;

  const nodeRef = selectedAudioRef ?
    selectedAudioRef.toString() : NodeRef.fromNode(selectedAudioNode).toString();

  return (
    <div className="container-lg p-5">
      <ImagePickerField
        label="Image"
        nodeRef={nodeRef}
        onSelectImage={setImageRef}
        selectedImageRef={selectedImageRef}
      />
      <TextField
        name="launch_text"
        label="Launch Text"
        value={launchText}
        onChange={(e) => setLaunchText(e.target.value)}
      />
      <SwitchField
        name="aside"
        label="Aside"
        checked={aside}
        onChange={(e) => setAside(e.target.checked)}
        tooltip="Is only indirectly related to the main content."
      />
    </div>
  );
}
