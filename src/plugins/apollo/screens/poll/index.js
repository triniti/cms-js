import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';

import delegateFactory from '@triniti/cms/plugins/apollo/screens/poll/delegate';
import Form from '@triniti/cms/plugins/apollo/screens/poll/Form';
import selector from '@triniti/cms/plugins/apollo/screens/poll/selector';

class PollScreen extends AbstractNodeScreen {
  static propTypes = {
    ...AbstractNodeScreen.propTypes,
  };

  static defaultProps = {
    ...AbstractNodeScreen.defaultProps,
  };

  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
      'taxonomy',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PollScreen);
