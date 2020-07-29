import memoize from 'lodash/memoize';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';
import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

const hasWidgetHasSearchRequestMixin = memoize((type, nodeSchemas) => nodeSchemas
  .find((schema) => schema.getCurie().getMessage() === type)
  .hasMixin('triniti:curator:mixin:widget-has-search-request'));

class WidgetScreen extends AbstractNodeScreen {
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
    const { delegate, match } = this.props;
    return [
      'details',
      hasWidgetHasSearchRequestMixin(match.params.type, delegate.getSchemas().nodes) && 'data-source',
      'code',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(WidgetScreen);
