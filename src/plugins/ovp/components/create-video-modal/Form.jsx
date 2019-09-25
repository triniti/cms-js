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
        label="Title"
        name="title"
        onKeyDown={handleKeyDown}
        placeholder="enter title"
        type="text"
      />
      <Field
        onKeyDown={handleKeyDown}
        name="slug"
        type="text"
        normalize={handleNormalizeSlug}
        component={TextField}
        label="Slug"
        placeholder="enter slug"
      />
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
  onNormalizeSlug: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
