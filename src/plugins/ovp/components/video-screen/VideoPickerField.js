/**
 * Video Picker Field for Details Tab
 */
import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';

const DetailsTabVideoPickerField = (props) => {
    return (
        <VideoPickerField
            {...props}
            statuses={props.statuses}
        />
    );
};

export default DetailsTabVideoPickerField;