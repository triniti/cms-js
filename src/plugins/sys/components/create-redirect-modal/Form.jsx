import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import RedirectFields from '@triniti/cms/plugins/sys/components/redirect-fields';

const Form = ({ onKeyDown: handleKeyDown }) => (
  <RedirectFields onKeyDown={handleKeyDown} isEditMode />
);

Form.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default reduxForm()(Form);
