import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Message from '@gdbots/pbj/Message';
import CreateNodeModal from '@triniti/cms/plugins/ncr/components/create-node-modal';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from './delegate';
import selector from './selector';
import Form from './Form';
import schemas from './schemas';

const CreateTeaserModal = ({ formValues, target, ...rest }) => {
  schemas.node = schemas.nodes
    .find((schema) => schema.getCurie().getMessage() === get(formValues, 'type.value'));

  return <CreateNodeModal formComponent={Form} formConfigs={{ formValues, target, schemas }} headerText="Create Teaser" {...rest} />;
};

CreateTeaserModal.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line
  target: PropTypes.instanceOf(Message),
};

CreateTeaserModal.defaultProps = {
  formValues: null,
  target: null,
};

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)(CreateTeaserModal));
