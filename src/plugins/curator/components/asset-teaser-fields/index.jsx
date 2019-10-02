import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <Field
    name="targetRef"
    component={ImageAssetPickerField}
    isEditMode={false}
    {...props}
  />
);

const AssetTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

AssetTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

AssetTeaserFields.defaultProps = {
  isEditMode: false,
};

export default AssetTeaserFields;
