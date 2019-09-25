import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import selector from '@triniti/cms/plugins/iam/screens/user/selector';
import delegateFactory from '@triniti/cms/plugins/iam/screens/user/delegate';
import Form from '@triniti/cms/plugins/iam/screens/user/Form';

class UserScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
      'roles',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(UserScreen);
