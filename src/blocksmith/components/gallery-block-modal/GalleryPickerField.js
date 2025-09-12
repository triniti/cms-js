/**
 * Gallery Picker Field for Gallery Block Modal
 */
import React from 'react';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

const GalleryBlockGalleryPickerField = (props) => {
    const defaultStatuses = [NodeStatus.PUBLISHED];

    return (
        <GalleryPickerField
            {...props}
            statuses={props.statuses || defaultStatuses}
        />
    );
};

export default GalleryBlockGalleryPickerField;
