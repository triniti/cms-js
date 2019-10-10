import endsWith from 'lodash/endsWith';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';

import PicklistId from '@triniti/schemas/triniti/sys/PicklistId';
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
    return `${PicklistId.create(value).toString()}-`;
  }

  return value && PicklistId.create(value).toString();
};

const Form = ({ onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field onKeyDown={handleKeyDown} name="title" component={TextField} label="title" normalize={normalize} placeholder="enter title..." />
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
