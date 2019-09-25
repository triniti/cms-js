import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';

import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import schemas from './schemas';

const typeOptions = schemas.nodes.map((schema) => ({
  label: schema.getCurie().getMessage().replace(/(-|widget)/g, ' '),
  value: schema.getCurie().getMessage(),
}));

const Form = ({ formValues, onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field name="type" component={SelectField} label="layout" options={typeOptions} />
      {
        get(formValues, 'type.value')
        && (
          <Field
            component={TextField}
            label="name"
            name="title"
            onKeyDown={handleKeyDown}
            placeholder="enter name"
          />
        )
      }
    </CardBody>
  </Card>
);

Form.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onKeyDown: PropTypes.func.isRequired,
};

Form.defaultProps = {
  formValues: null,
};

export default reduxForm()(Form);
