import React from 'react';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { NumberField, SwitchField, TextField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import useNode from 'plugins/ncr/components/useNode';

export default function CustomizeOptions(props) {
  const {
    aside,
    setAside,
    autoPlay,
    setAutoPlay,
    muted,
    setMuted,
    selectedVideoNode,
    selectedVideoNodeRef,
    selectedImageRef,
    setImageRef,
    launchText,
    setLaunchText,
    showMoreVideos,
    setShowMoreVideos,
    startAt,
    setStartAt
  } = props;

  const nodeRef = selectedVideoNodeRef ?
    selectedVideoNodeRef.toString() : NodeRef.fromNode(selectedVideoNode).toString();
  const { node } = useNode(selectedVideoNodeRef, false);
  const cachedVideoNode = selectedVideoNode || node;

  return (
    <div className="container-lg p-5">
      <ImagePickerField
        name="poster_image"
        label="Poster Image"
        nodeRef={nodeRef}
        onSelectImage={setImageRef}
        selectedImageRef={selectedImageRef || cachedVideoNode.get('image_ref')}
        launchText={launchText || cachedVideoNode.get('launch_text')}
      />
      <SwitchField
        name="autoplay"
        label="Autoplay"
        disabled={false}
        checked={autoPlay}
        onChange={(e) => setAutoPlay(e.target.checked)}
      />
      <SwitchField
        name="auto_mute"
        label="Auto mute"
        disabled={false}
        checked={muted}
        onChange={(e) => setMuted(e.target.checked)}
      />
      <SwitchField
        name="show_related_videos"
        label="Show related videos"
        disabled={false}
        checked={showMoreVideos}
        onChange={(e) => setShowMoreVideos(e.target.checked)}
      />
      <TextField
        name="launch_text"
        label="Launch Text"
        value={launchText}
        onChange={(e) => setLaunchText(e.target.value)}
      />
      <NumberField
        name="start_at"
        label="Start at"
        value={startAt}
        onChange={(e) => setStartAt(parseInt(e.target.value))}
      />
      <SwitchField
        name="aside"
        label="Aside"
        disabled={false}
        checked={aside}
        onChange={(e) => setAside(e.target.checked)}
        tooltip="Is only indirectly related to the main content."
      />
    </div>
  );
}
