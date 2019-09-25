import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CreateNodeModal from '@triniti/cms/plugins/ncr/components/create-node-modal';
import Form from '@triniti/cms/plugins/iam/components/create-app-modal/Form';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from './delegate';
import selector from './selector';
import schemas from './schemas';

const CreateAppModal = ({ formValues, ...rest }) => {
  if (formValues && formValues.type) {
    schemas.node = schemas.nodes
      .find((schema) => schema.getCurie().getMessage() === formValues.type.value);
  }

  return <CreateNodeModal formComponent={Form} formConfigs={{ formValues, schemas }} headerText="Create App" {...rest} />;
};

CreateAppModal.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line
};

CreateAppModal.defaultProps = {
  formValues: null,
};

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)(CreateAppModal));
