/**
 * Video Picker Field for Details Tab
 */
import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

const DetailsTabVideoPickerField = (props) => {
    const defaultStatuses = [NodeStatus.PUBLISHED];

    return (
        <VideoPickerField
            {...props}
            statuses={props.statuses || defaultStatuses}
        />
    );
};

export default DetailsTabVideoPickerField;