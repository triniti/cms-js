import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';

import KeyValuesField from '@triniti/cms/components/key-values-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const FlagsetFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field
        className="pb-2"
        component={TextField}
        label="Flagset Title"
        name="title"
        placeholder="Flagset Title"
        readOnly
      />
      <FieldArray
        component={KeyValuesField}
        label="Boolean Flags"
        name="booleans"
        readOnly={!isEditMode}
        type="Flag"
        valueType="boolean"
      />
      <hr />
      <FieldArray
        component={KeyValuesField}
        label="Float Flags"
        name="floats"
        readOnly={!isEditMode}
        type="Flag"
        valueType="number"
      />
      <hr />
      <FieldArray
        component={KeyValuesField}
        label="Integer Flags"
        name="ints"
        readOnly={!isEditMode}
        type="Flag"
        valueType="number"
      />
      <hr />
      <FieldArray
        component={KeyValuesField}
        label="String Flags"
        name="strings"
        readOnly={!isEditMode}
        type="Flag"
      />
      <hr />
      <FieldArray
        component={KeyValuesField}
        label="Trinary Flags"
        name="trinaries"
        readOnly={!isEditMode}
        type="Flag"
        valueType="trinary"
      />
    </CardBody>
  </Card>
);

FlagsetFields.propTypes = {
  isEditMode: PropTypes.bool,
};

FlagsetFields.defaultProps = {
  isEditMode: false,
};

export default FlagsetFields;
