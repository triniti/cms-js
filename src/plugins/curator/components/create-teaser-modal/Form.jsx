import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { reduxForm, Field } from 'redux-form';
import SelectField from '@triniti/cms/components/select-field';
import schemas from './schemas';

const typeOptions = schemas.nodes.map((schema) => ({
  label: schema.getCurie().getMessage().replace(/(-|teaser)/g, ' '),
  value: schema.getCurie().getMessage(),
}));

const teaserFieldsComponents = {};
function getFieldsComponent(type) {
  if (schemas.nodes.find((node) => node.getCurie().getMessage() === type).fields.has('target_ref')) {
    // this weirdness prevents another bug where the selectorRef in the picker is undefined
    // fixme: replace template literal
    // return createLazyComponent(import(`@triniti/cms/plugins/curator/components/create-${type}-fields`));
  }
  if (!teaserFieldsComponents[type]) {
    // this weirdness prevents this bug: https://stackoverflow.com/questions/39839051/using-redux-form-im-losing-focus-after-typing-the-first-character
    // fixme: replace template literal
    // teaserFieldsComponents[type] = createLazyComponent(import(`@triniti/cms/plugins/curator/components/create-${type}-fields`));
  }
  return teaserFieldsComponents[type];
}

const Form = ({ formValues, onKeyDown: handleKeyDown, onReset: handleReset }) => {
  const type = get(formValues, 'type.value');
  const FieldsComponent = type ? getFieldsComponent(type) : null;
  return (
    <Card>
      <CardBody indent>
        <Field name="type" component={SelectField} label="type" options={typeOptions} onChange={handleReset} />
        {
          FieldsComponent && <FieldsComponent onKeyDown={handleKeyDown} />
        }
      </CardBody>
    </Card>
  );
};

Form.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onKeyDown: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

Form.defaultProps = {
  formValues: null,
};

export default reduxForm({ forceUnregisterOnUnmount: true })(Form);
