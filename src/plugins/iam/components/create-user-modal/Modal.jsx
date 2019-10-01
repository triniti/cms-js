import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CreateNodeModal from '@triniti/cms/plugins/ncr/components/create-node-modal';
import Form from '@triniti/cms/plugins/iam/components/create-user-modal/Form';

import delegateFactory from './delegate';
import selector from './selector';

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)((props) => <CreateNodeModal formComponent={Form} buttonText="Add User" headerText="Create User" {...props} />));
