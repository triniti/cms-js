import { connect } from 'react-redux';
import { EditorState } from 'draft-js';
import PropTypes from 'prop-types';
import React from 'react';
import blockParentNode from '@triniti/cms/plugins/blocksmith/utils/blockParentNode';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/blocksmith/components/blocksmith/delegate';
import validateBlocks from '@triniti/cms/plugins/blocksmith/utils/validateBlocks';

import Fallback from './Fallback';
import { getWordCount } from '../../../utils';
import selector from './selector';

const MAX_ERROR_COUNT = 5;

export class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    delegate: PropTypes.shape({
      handleDirtyEditor: PropTypes.func.isRequired,
      handleStoreEditor: PropTypes.func.isRequired,
    }).isRequired,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    getNode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      errorCount: 0,
      hasError: false,
      isValid: true,
    };

    this.handleRestoreBlocksmith = this.handleRestoreBlocksmith.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // `setTimeout` ensures that the parent's `setEditorState` fn will always be
    // invoked first in order to have the latest/greatest prop.
    setTimeout(() => this.handleRestoreBlocksmith(false));
    console.error(error, errorInfo);
    window.onerror(error);
  }

  handleRestoreBlocksmith(resetErrorCount = true, excludeInvalidBlocks = true) {
    const { errorCount } = this.state;
    const { delegate, editorState } = this.props;
    const { blocks, isValid, validEditorState } = validateBlocks(editorState);
    if (!resetErrorCount && (!isValid || errorCount >= MAX_ERROR_COUNT)) {
      return;
    }

    this.setState(() => ({
      blocks,
      errorCount: resetErrorCount ? 0 : errorCount + 1,
      hasError: false,
      isValid,
    }), () => {
      blockParentNode.clearCache();
      delegate.handleStoreEditor(excludeInvalidBlocks ? validEditorState : editorState);
    });
  }

  render() {
    const {
      delegate,
      editorState,
      children,
      getNode,
    } = this.props;
    const { blocks, hasError, isValid } = this.state;

    if (!hasError) {
      return children;
    }

    return (
      <Fallback
        blocks={blocks}
        getNode={getNode}
        isValid={isValid}
        onRestoreAllBlocks={() => this.handleRestoreBlocksmith(true, false)}
        onRestoreValidBlocks={() => {
          this.handleRestoreBlocksmith();
          delegate.handleDirtyEditor();
        }}
        wordCount={getWordCount(editorState)}
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(ErrorBoundary);
