import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Field } from 'redux-form';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';
import CheckboxField from '@triniti/cms/components/checkbox-field';

const UserFields = ({ editableEmail, showBlockOption, isEditMode, onKeyDown: handleKeyDown }) => (
  <Card>
    <CardBody indent>
      <Field
        component={TextField}
        label="Email"
        name="email"
        onKeyDown={handleKeyDown}
        placeholder="enter email address"
        readOnly={!editableEmail}
      />
      <Field
        component={TextField}
        label="First Name"
        name="firstName"
        onKeyDown={handleKeyDown}
        placeholder="enter first name"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="Last Name"
        name="lastName"
        onKeyDown={handleKeyDown}
        placeholder="enter last name"
        readOnly={!isEditMode}
      />
      <Field
        component={CheckboxField}
        disabled={!isEditMode}
        label="Staff"
        name="isStaff"
      />
      {showBlockOption
      && (
      <Field
        component={CheckboxField}
        disabled={!isEditMode}
        label="Blocked"
        name="isBlocked"
      />
      )}
    </CardBody>
  </Card>
);

UserFields.propTypes = {
  editableEmail: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onKeyDown: PropTypes.func,
  showBlockOption: PropTypes.bool,
};

UserFields.defaultProps = {
  editableEmail: false,
  isEditMode: true,
  onKeyDown: noop,
  showBlockOption: true,
};

export default UserFields;
