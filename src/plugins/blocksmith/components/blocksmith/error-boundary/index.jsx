import { connect } from 'react-redux';
import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
// import pbjUrl from '@gdbots/pbjx/pbjUrl';
import React from 'react';
import blockParentNode from '@triniti/cms/plugins/blocksmith/utils/blockParentNode';
import validateBlocks from '@triniti/cms/plugins/blocksmith/utils/validateBlocks';
import delegate from './delegate';
import selector from './selector';

const MAX_ERROR_COUNT = 1;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCount: 0,
      hasError: false,
      hasRecoveredFromContinuedErrors: false,
    };

    this.recoverFromContinuedErrors = this.recoverFromContinuedErrors.bind(this);
    this.restoreBlocksmith = this.restoreBlocksmith.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  recoverFromContinuedErrors(editorState) {
    const { handleStoreEditor } = this.props;
    this.setState(() => ({
      hasRecoveredFromContinuedErrors: true,
      errorCount: 0,
      hasError: false,
    }), () => {
      blockParentNode.clearCache();
      handleStoreEditor(editorState);
    });
  }

  restoreBlocksmith(editorState) {
    const { handleStoreEditor } = this.props;
    this.setState(({ errorCount }) => ({
      errorCount: errorCount + 1,
      hasError: false,
    }), () => {
      blockParentNode.clearCache();
      handleStoreEditor(editorState);
    });
  }

  render() {
    const { children, blocksmithState, getNode } = this.props;
    const { errorCount, hasError, hasRecoveredFromContinuedErrors } = this.state;

    if (!hasError) {
      return children;
    }

    if (!blocksmithState || !blocksmithState.editorState) {
      return <p>https://www.youtube.com/watch?v=3WSe9ugpXIw</p>;
    }

    const { validEditorState, validCanvasBlocks, wasValid } = validateBlocks(blocksmithState.editorState);
    if (errorCount >= MAX_ERROR_COUNT) {
      if (wasValid) {
        if (hasRecoveredFromContinuedErrors) {
          // const contentBlocks = validEditorState.getCurrentContent().getBlocksAsArray();
          return (
            <>
              <p>the editor is experiencing continued failures. the blocks are valid but some issue is causing it to crash. press the button below to restore the editor.</p>
              <Button
              // className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
                onClick={() => this.recoverFromContinuedErrors(validEditorState)}
                size="md"
              >
                hi
              </Button>
              <p>if you continue to see this message, then something is really wrong. the blocks are still valid, but we recommend that you save now and refresh the page.</p>
              {validCanvasBlocks.map((block, i) => {
                const message = block.schema().getId().getCurie().getMessage();
                // if (block.has('node_ref')) {
                //   const node = getNode(block.get('node_ref'));
                //   // return (
                //   //   <RouterLink to={pbjUrl(node, 'cms')}>
                //   //     {`${message.replace(/-block/, '')} for ${node.get('title')}`}
                //   //   </RouterLink>
                //   // );
                //   // return <p>{`${message.replace(/-block/, '')} for`}</p>
                // }
                switch (message) {
                  case 'image-block':
                    return <img src={damUrl(getNode(block.get('node_ref')), 'o', 'xs')} alt="thumbnail" />;
                  case 'text-block':
                    return <div dangerouslySetInnerHTML={{ __html: block.get('text') }} />;
                  default:
                    return <p>{message}</p>;
                }
              })}
            </>
          );
        }
        return (
          <>
            <p>the editor is experiencing continued failures. the blocks are valid but some issue is causing it to crash. press the button below to restore the editor.</p>
            <Button
              // className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
              onClick={() => this.recoverFromContinuedErrors(validEditorState)}
              size="md"
            >
              hi
            </Button>
          </>
        );
      }

      return <h1>too many errors on the dance floor</h1>;
    }
    if (blocksmithState.editorState) {
      if (validEditorState) {
        this.restoreBlocksmith(validEditorState);
      }
      return <h1>useful</h1>;
    }
    return <h1>Something went wrong.</h1>;
  }
}

export default connect(selector, delegate)(ErrorBoundary);
