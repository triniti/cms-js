import { connect } from 'react-redux';

import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';

import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

/* eslint-disable class-methods-use-this */
class RedirectScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(RedirectScreen);
