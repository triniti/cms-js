import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import KeyValuesField from '@triniti/cms/components/key-values-field';
import { CardBody, CardCollapse } from '@triniti/admin-ui-plugin/components';

const AdvancedFields = ({ isEditMode }) => (
  <CardCollapse title="Advanced">
    <CardBody indent>
      <FieldArray readOnly={!isEditMode} name="tags" type="Tag" component={KeyValuesField} />
    </CardBody>
  </CardCollapse>
);

AdvancedFields.propTypes = {
  isEditMode: PropTypes.bool,
};

AdvancedFields.defaultProps = {
  isEditMode: true,
};

export default AdvancedFields;
