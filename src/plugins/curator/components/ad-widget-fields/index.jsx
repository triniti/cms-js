import get from 'lodash/get';
import PropTypes from 'prop-types';
import upperCase from 'lodash/upperCase';
import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import AdSizeEnum from '@triniti/schemas/triniti/common/enums/AdSize';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import KeyValuesField from '@triniti/cms/components/key-values-field';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';
import selector from './selector';

const adSizeOptions = humanizeEnums(AdSizeEnum, {
  format: 'map',
  shouldStartCase: false,
  except: [AdSizeEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label,
  value: upperCase(value).replace(/\s/g, '_'),
}));

const AdWidgetFields = ({ formValues, isEditMode }) => (

  <Card>
    <CardHeader>Options</CardHeader>
    <CardBody indent>
      <Field name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" readOnly={!isEditMode} />
      <Field name="adSize" component={SelectField} label="Ad Size" placeholder="Select Ad Size" options={adSizeOptions} disabled={!isEditMode} />
      <Field name="dfpAdUnitPath" component={TextField} label="DFP Ad Unit Path" placeholder="Enter DFP Ad Unit Path" readOnly={!isEditMode} />
      <FieldArray
        component={KeyValuesField}
        label="DFP Custom Parameters"
        name="dfpCustParams"
        readOnly={!isEditMode}
        type="Parameter"
      />
      <div className="pb-1 d-md-inline-flex">
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Show Header"
          name="showHeader"
        />
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Show Border"
          name="showBorder"
        />
      </div>
      <Field
        component={TextField}
        disabled={!get(formValues, 'showHeader')}
        label="Header Text"
        name="headerText"
        placeholder="Enter header text"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="View All Text"
        name="viewAllText"
        placeholder="Enter view all text"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="View All URL"
        name="viewAllUrl"
        placeholder="Enter view all URL"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="Partner Text"
        name="partnerText"
        placeholder="Enter partner text"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="Partner URL"
        name="partnerUrl"
        placeholder="Enter partner URL"
        readOnly={!isEditMode}
      />
    </CardBody>
  </Card>
);

AdWidgetFields.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
};

AdWidgetFields.defaultProps = {
  formValues: null,
  isEditMode: false,
};

export default connect(selector)(AdWidgetFields);
