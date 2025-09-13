/**
 * Video Picker Field for Video Block Modal
 */
import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';

const VideoBlockVideoPickerField = (props) => {
    return (
        <VideoPickerField
            {...props}
            statuses={props.statuses}
        />
    );
};

export default VideoBlockVideoPickerField;
