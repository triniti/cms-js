import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import UploaderAssetFields from '@triniti/cms/plugins/dam/components/uploader-asset-fields';

const Form = (props) => <UploaderAssetFields {...props} />;

Form.propTypes = {
  form: PropTypes.string.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(Form);
