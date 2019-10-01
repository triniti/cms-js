import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import TextField from '@triniti/cms/components/text-field';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <Field
    component={TextField}
    label="Link URL"
    name="linkUrl"
    readOnly={false}
    {...props}
  />
);

const AdditionalFields = (props) => (
  <>
    <Field
      component={TextField}
      label="Partner URL"
      name="partnerUrl"
      placeholder="Enter partner URL"
      {...props}
    />

    <Field
      component={TextField}
      label="Partner Text"
      name="partnerText"
      placeholder="Enter partner text"
      {...props}
    />
  </>
);

const LinkTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
    additionalFields={AdditionalFields}
  />
);

LinkTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

LinkTeaserFields.defaultProps = {
  isEditMode: false,
};

export default LinkTeaserFields;
