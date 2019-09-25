import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';
import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

class PromotionScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
      'schedule',
      'code',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PromotionScreen);
