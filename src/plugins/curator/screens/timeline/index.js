import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';
import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';
import schemas from './schemas';

class TimelineScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
      schemas.node.hasMixin('triniti:common:mixin:custom-code') && 'code',
      'taxonomy',
      schemas.node.hasMixin('triniti:common:mixin:seo') && 'seo',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(TimelineScreen);
