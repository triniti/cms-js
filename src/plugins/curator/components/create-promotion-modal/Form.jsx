import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { reduxForm, Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';

const Form = ({ onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field onKeyDown={handleKeyDown} name="title" component={TextField} label="name" />
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
