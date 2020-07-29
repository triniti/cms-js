import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';

import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';

import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

/* eslint-disable class-methods-use-this */
class PersonScreen extends AbstractNodeScreen {
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

  getBreadcrumbs() {
    const { delegate } = this.props;
    const node = delegate.getNode();

    return [
      {
        to: '/people/people/',
        text: 'People',
      },
      { text: (node && node.get('title')) || 'Loading...' },
    ];
  }

  getFormRenderProps() {
    const { blocksmithState, getNodeRequestState } = this.props;
    return { blocksmithState, getNodeRequestState };
  }

  getForm() {
    return Form;
  }

  getTabs() {
    const { delegate } = this.props;
    return [
      'details',
      'taxonomy',
      delegate.getSchemas().node.hasMixin('triniti:common:mixin:seo') && 'seo',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PersonScreen);
