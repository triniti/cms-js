import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import delegateFactory from '@triniti/cms/plugins/iam/screens/role/delegate';
import Form from '@triniti/cms/plugins/iam/screens/role/Form';
import selector from '@triniti/cms/plugins/iam/screens/role/selector';

class RoleScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(RoleScreen);
