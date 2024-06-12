import React from 'react';
import ReactPlayer from 'react-player';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

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
      <ReactPlayer.default
        className="react-player"
        controls
        height="calc(4em + 2px)"
        url={`${damUrl(selectedAudioNode)}`}
        width="100%"
      />
      <ImagePickerField
        label="Image"
        name="node_ref"
        nodeRef={nodeRef}
        onSelectImage={setImageRef}
        launchText={launchText}
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
