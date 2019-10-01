import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import KeyValuesField from '@triniti/cms/components/key-values-field';
import { CardBody, CardCollapse } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';

const AdvertisingFields = ({ isEditMode }) => (
  <CardCollapse title="Advertising">
    <CardBody indent>
      <Field name="adsEnabled" component={CheckboxField} label="Ads Enabled" disabled={!isEditMode} />
      <Field name="dfpAdUnitPath" component={TextField} label="DFP Ad Unit Path" placeholder="Enter DFP Ad Unit Path" readOnly={!isEditMode} />
      <FieldArray
        component={KeyValuesField}
        label="DFP Custom Parameters"
        name="dfpCustParams"
        readOnly={!isEditMode}
        type="Parameter"
      />
    </CardBody>
  </CardCollapse>
);

AdvertisingFields.propTypes = {
  isEditMode: PropTypes.bool,
};

AdvertisingFields.defaultProps = {
  isEditMode: true,
};

export default AdvertisingFields;
