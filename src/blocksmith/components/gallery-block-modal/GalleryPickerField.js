/**
 * Gallery Picker Field for Gallery Block Modal
 */
import React from 'react';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';

const GalleryBlockGalleryPickerField = (props) => {
    return (
        <GalleryPickerField
            {...props}
            statuses={props.statuses}
        />
    );
};

export default GalleryBlockGalleryPickerField;
