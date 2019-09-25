import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import selector from './selector';

const CodeWidgetFields = ({ formValues, isEditMode }) => (
  <Card>
    <CardHeader>Options</CardHeader>
    <CardBody indent>
      <Field name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" readOnly={!isEditMode} />
      <Field
        component={TextareaField}
        label="Code"
        name="code"
        readOnly={!isEditMode}
        rows={5}
        type="textarea"
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

CodeWidgetFields.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
};

CodeWidgetFields.defaultProps = {
  formValues: null,
  isEditMode: false,
};

export default connect(selector)(CodeWidgetFields);
