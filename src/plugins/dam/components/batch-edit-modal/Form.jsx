import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import BatchEditFields from './BatchEditFields';

const Form = (props) => <BatchEditFields {...props} />;

Form.propTypes = {
  form: PropTypes.string.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
