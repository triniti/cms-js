import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CreateNodeModal from '@triniti/cms/plugins/ncr/components/create-node-modal';

import delegateFactory from './delegate';
import Form from './Form';
import schemas from './schemas';
import selector from './selector';

const CreateWidgetModal = ({ formValues, ...rest }) => {
  if (formValues && formValues.type) {
    schemas.node = schemas.nodes
      .find((schema) => schema.getCurie().getMessage() === formValues.type.value);
  }

  return (
    <CreateNodeModal
      formComponent={Form}
      formConfigs={{ formValues, schemas }}
      headerText="Create Widget"
      {...rest}
    />
  );
};

CreateWidgetModal.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line
};

CreateWidgetModal.defaultProps = {
  formValues: null,
};

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)(CreateWidgetModal));
