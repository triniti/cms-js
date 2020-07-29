import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';

import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

class AppScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getFormRenderProps() {
    const { getNodeRequestState } = this.props;
    return {
      getNodeRequestState,
      type: this.props.match.params.type,
    };
  }

  getTabs() {
    return [
      'details',
      'roles',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(AppScreen);
