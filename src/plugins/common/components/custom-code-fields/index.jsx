import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import TextareaField from '@triniti/cms/components/textarea-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const CustomCodeFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Code</CardHeader>
    <CardBody indent>
      <Field
        component={TextareaField}
        label="Append to HTML Head Tag"
        name="htmlHead"
        readOnly={!isEditMode}
        rows={5}
        type="textarea"
      />
      <Field
        component={TextareaField}
        label="After Site Header"
        name="afterHeader"
        readOnly={!isEditMode}
        rows={5}
        type="textarea"
      />
      <Field
        component={TextareaField}
        label="Footer Scripts"
        name="afterFooter"
        readOnly={!isEditMode}
        rows={5}
        type="textarea"
      />
    </CardBody>
  </Card>
);

CustomCodeFields.propTypes = {
  isEditMode: PropTypes.bool,
};

CustomCodeFields.defaultProps = {
  isEditMode: false,
};

export default CustomCodeFields;
