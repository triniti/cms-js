import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import get from 'lodash/get';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';
import schemas from './schemas';

const typeOptions = schemas.nodes
  .map((schema) => ({
    label: schema.getCurie().getMessage().replace('-app', ''),
    value: schema.getCurie().getMessage(),
  }));

const Form = ({ formValues, onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field name="type" component={SelectField} label="type" options={typeOptions} />
      {
        get(formValues, 'type.value')
        && <Field onKeyDown={handleKeyDown} name="title" component={TextField} label="title" />
      }
    </CardBody>
  </Card>
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Form.defaultProps = {
  formValues: null,
};

export default reduxForm()(Form);
