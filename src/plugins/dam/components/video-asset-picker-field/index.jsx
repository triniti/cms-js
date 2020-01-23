import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import VideoAssetPicker from '@triniti/cms/plugins/dam/components/video-asset-picker';

const VideoAssetPickerField = ({ input, isEditMode }) => {
  const { value } = input;
  return (
    <VideoAssetPicker
      isEditMode={isEditMode}
      onClearVideoAsset={() => input.onChange(null)}
      onSelectVideoAsset={(nodeRef) => input.onChange(value && value.equals(nodeRef) ? null : nodeRef)}
      selectedVideoAssetRef={value}
    />
  );
};

VideoAssetPickerField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.instanceOf(NodeRef),
      PropTypes.string,
    ]),
  }).isRequired,
  isEditMode: PropTypes.bool,
};

VideoAssetPickerField.defaultProps = {
  isEditMode: false,
};

export default VideoAssetPickerField;
