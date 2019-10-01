// todo: use SelectField with multi option instead of a FieldArray to add/remove permissions
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader, Label } from '@triniti/admin-ui-plugin/components';

import Permissions from './Permissions';
import selector from './selector';

const RoleFields = ({ options, role, isEditMode }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field
        component={TextField}
        label="Role Name"
        name="_id"
        placeholder="Role Name"
        readOnly={!isEditMode}
      />
      <Label for="allowed">Allowed Permissions</Label>
      {isEditMode ? (
        <FieldArray
          component={Permissions}
          name="allowed"
          options={options}
          readOnly={!isEditMode}
        />
      ) : (
        <ul>
          {
            role.has('allowed') ? role.get('allowed').map(
              (permission, index) => <li key={`${permission}-${index + 1}`}>{permission}</li>,
            ) : <li>none</li>
          }
        </ul>
      )}
      <Label for="allowed">Denied Permissions</Label>
      {isEditMode ? (
        <FieldArray
          component={Permissions}
          label="Denied Permissions"
          name="denied"
          options={options}
          readOnly={!isEditMode}
        />
      ) : (
        <ul>
          {
            role.has('denied') ? role.get('denied').map(
              (permission, index) => <li key={`${permission}-${index + 1}`}>{permission}</li>,
            ) : <li>none</li>
          }
        </ul>
      )}
    </CardBody>
  </Card>
);

RoleFields.propTypes = {
  isEditMode: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  role: PropTypes.instanceOf(Message).isRequired,
};

RoleFields.defaultProps = {
  isEditMode: false,
  options: [],
};

export default connect(selector)(RoleFields);
