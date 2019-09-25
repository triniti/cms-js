import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CreateNodeModal from '@triniti/cms/plugins/ncr/components/create-node-modal';
import Form from '@triniti/cms/plugins/curator/components/create-timeline-modal/Form';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from './delegate';
import selector from './selector';

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)((props) => <CreateNodeModal formComponent={Form} headerText="Create Timeline" {...props} />));
