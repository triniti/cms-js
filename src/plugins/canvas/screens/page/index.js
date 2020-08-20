import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/canvas/screens/page/delegate';
import Form from '@triniti/cms/plugins/canvas/screens/page/Form';
import selector from '@triniti/cms/plugins/canvas/screens/page/selector';

class PageScreen extends AbstractNodeScreen {
  static propTypes = {
    ...AbstractNodeScreen.propTypes,
    blocksmithState: PropTypes.shape({
      editorState: PropTypes.instanceOf(EditorState),
      isDirty: PropTypes.bool.isRequired,
    }),
  };

  static defaultProps = {
    ...AbstractNodeScreen.defaultProps,
    blocksmithState: null,
  };

  getFormRenderProps() {
    const { blocksmithState, getNodeRequestState } = this.props;
    const layouts = this.props.delegate.getPageLayouts();
    return { blocksmithState, getNodeRequestState, layouts };
  }

  getForm() {
    return Form;
  }

  getTabs() {
    const { delegate } = this.props;
    return [
      'details',
      'taxonomy',
      delegate.getSchemas().node.hasMixin('triniti:common:mixin:custom-code') && 'code',
      delegate.getSchemas().node.hasMixin('triniti:common:mixin:seo') && 'seo',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PageScreen);
