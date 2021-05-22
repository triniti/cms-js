import PropTypes from 'prop-types';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';

import delegateFactory from './delegate';
import Form from './Form';
import schemas from './schemas';
import selector from './selector';

class ChannelScreen extends AbstractNodeScreen {
  static propTypes = {
    ...AbstractNodeScreen.propTypes,
    formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    ...AbstractNodeScreen.defaultProps,
    formValues: {},
  };

  getForm() {
    return Form;
  }

  getFormRenderProps() {
    const { formValues, getNodeRequestState } = this.props;
    return { formValues, getNodeRequestState };
  }

  getTabs() {
    return [
      'details',
      schemas.node.hasMixin('triniti:common:mixin:custom-code') && 'code',
      schemas.node.hasMixin('triniti:common:mixin:seo') && 'seo',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(ChannelScreen);
