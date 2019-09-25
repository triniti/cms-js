import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';

import delegateFactory from '@triniti/cms/plugins/ovp/screens/video/delegate';
import Form from '@triniti/cms/plugins/ovp/screens/video/Form';
import selector from '@triniti/cms/plugins/ovp/screens/video/selector';

class VideoScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
      'taxonomy',
      this.props.delegate.getSchemas().node.hasMixin('triniti:common:mixin:seo') && 'seo',
      'media',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(VideoScreen);
