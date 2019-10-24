import { connect } from 'react-redux';
import { INJECT } from '@triniti/app/constants';
import { serviceIds } from '@triniti/cms/plugins/ncr/constants';
import { withRouter } from 'react-router';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CreateNodeModal from '@triniti/cms/plugins/ncr/components/create-node-modal';
import React from 'react';
import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

delegateFactory[INJECT] = {
  [serviceIds.SLUGGABLE_FORMS]: 'sluggableForms',
};

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)((props) => <CreateNodeModal formComponent={Form} headerText="Create Article" {...props} />));
