import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import UserFields from '@triniti/cms/plugins/iam/components/user-fields';

const Form = ({ onKeyDown: handleKeyDown }) => (
  <UserFields onKeyDown={handleKeyDown} showBlockOption={false} editableEmail />
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
