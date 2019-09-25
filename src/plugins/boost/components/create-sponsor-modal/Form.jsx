import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { reduxForm, Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';

const Form = ({ onNormalizeSlug: handleNormalizeSlug, onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field
        component={TextField}
        label="name"
        name="title"
        onKeyDown={handleKeyDown}
        placeholder="Enter Title"
      />
      <Field
        component={TextField}
        label="Slug"
        name="slug"
        normalize={handleNormalizeSlug}
        onKeyDown={handleKeyDown}
        placeholder="Enter Slug"
        type="text"
      />
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
  onNormalizeSlug: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
