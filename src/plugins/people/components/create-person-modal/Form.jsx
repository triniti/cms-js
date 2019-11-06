import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { reduxForm, Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';

const Form = ({ onBlurSlug: handleBlurSlug, onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field
        component={TextField}
        label="Name"
        name="title"
        onKeyDown={handleKeyDown}
        placeholder="name"
      />
      <Field
        component={TextField}
        label="Slug"
        name="slug"
        onBlur={handleBlurSlug}
        onKeyDown={handleKeyDown}
        placeholder="slug"
      />
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
  onBlurSlug: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
