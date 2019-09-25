import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';

const Form = ({ onNormalizeSlug: handleNormalizeSlug, onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field
        component={TextField}
        label="Title"
        name="title"
        onKeyDown={handleKeyDown}
        placeholder="enter title"
        type="text"
      />
      <Field
        component={TextField}
        label="Slug"
        name="slug"
        normalize={handleNormalizeSlug}
        onKeyDown={handleKeyDown}
        placeholder="enter slug"
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
