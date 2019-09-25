import endsWith from 'lodash/endsWith';
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import RoleId from '@gdbots/schemas/gdbots/iam/RoleId';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';

import TextField from '@triniti/cms/components/text-field';

const normalize = (value) => {
  if (value === '-') {
    return '';
  }
  const finalTwoChars = value.slice(-2);
  if (finalTwoChars === '--' || finalTwoChars === '- ') {
    return value.slice(0, -1);
  }
  if (endsWith(value, ' ')) {
    return `${value.slice(0, -1)}-`;
  }
  if (endsWith(value, '-')) {
    return `${RoleId.create(value).toString()}-`;
  }

  return value && RoleId.create(value).toString();
};

const Form = ({ onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field
        component={TextField}
        label="Role Name"
        name="_id"
        normalize={normalize}
        onKeyDown={handleKeyDown}
        placeholder="enter role name"
      />
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
