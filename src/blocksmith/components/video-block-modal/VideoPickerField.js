/**
 * Video Picker Field for Video Block Modal
 */
import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

const VideoBlockVideoPickerField = (props) => {
    const defaultStatuses = [NodeStatus.PENDING, NodeStatus.PUBLISHED, NodeStatus.SCHEDULED];

    return (
        <VideoPickerField
            {...props}
            statuses={props.statuses || defaultStatuses}
        />
    );
};

export default VideoBlockVideoPickerField;
