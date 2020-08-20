import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { EditorState } from 'draft-js';

import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/news/screens/article/delegate';
import { Icon } from '@triniti/admin-ui-plugin/components';

import Form from './Form';
import selector from './selector';

class ArticleScreen extends AbstractNodeScreen {
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
    return { blocksmithState, getNodeRequestState };
  }

  getForm() {
    return Form;
  }

  getBadge() {
    const { isLocked } = this.props;
    return isLocked ? (
      <Icon
        alert
        color="warning"
        imgSrc="locked-solid"
        size="xs"
        style={{ marginRight: '0.5rem' }}
      />
    ) : null;
  }

  getTabs() {
    return [
      'story',
      'details',
      'taxonomy',
      this.props.delegate.getSchemas().node.hasMixin('triniti:common:mixin:seo') && 'seo',
      this.props.delegate.getSchemas().node.hasMixin('triniti:notify:mixin:has-notifications') && 'notifications',
      'media',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(ArticleScreen);
