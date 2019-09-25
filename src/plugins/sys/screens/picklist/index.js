import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';

import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

class PicklistScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
    ];
  }

  getBreadcrumbs() {
    const { delegate } = this.props;
    const node = delegate.getNode();

    return [
      {
        to: '/sys/picklists',
        text: 'Picklists',
      },
      { text: (node && node.get('_id').toString()) || 'Loading...' },
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PicklistScreen);
