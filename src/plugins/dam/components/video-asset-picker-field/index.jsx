import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import VideoAssetPicker from '@triniti/cms/plugins/dam/components/video-asset-picker';

const VideoAssetPickerField = ({ input, isEditMode, label }) => {
  const { value } = input;
  return (
    <VideoAssetPicker
      isEditMode={isEditMode}
      label={label}
      onClear={() => input.onChange(null)}
      onSelect={(nodeRef) => input.onChange(value && value.equals(nodeRef) ? null : nodeRef)}
      selectedRef={value || null}
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
  label: PropTypes.string,
};

VideoAssetPickerField.defaultProps = {
  isEditMode: false,
  label: 'Video Asset',
};

export default VideoAssetPickerField;
