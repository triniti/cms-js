import { connect } from 'react-redux';
import { Button } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import React from 'react';
import blockParentNode from '@triniti/cms/plugins/blocksmith/utils/blockParentNode';
import validateBlocks from '@triniti/cms/plugins/blocksmith/utils/validateBlocks';
import delegate from './delegate';
import selector from './selector';
import './styles.scss';

const MAX_ERROR_COUNT = 2;

// todo: look into <div> cannot appear as a descendant of <p>.
// todo: sort out what to render when EMPTY_BLOCK_TOKEN
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCount: 0,
      hasError: false,
      hasRecoveredFromContinuedErrors: false,
    };

    // this.recoverFromContinuedErrors = this.recoverFromContinuedErrors.bind(this);
    this.restoreBlocksmith = this.restoreBlocksmith.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  restoreBlocksmith(editorState, resetErrorCount = true) {
    const { handleStoreEditor } = this.props;
    this.setState(({ errorCount }) => ({
      errorCount: resetErrorCount ? 0 : errorCount + 1,
      hasError: false,
    }), () => {
      blockParentNode.clearCache();
      handleStoreEditor(editorState);
    });
  }

  render() {
    const { children, editorState, blocksmithState, getNode } = this.props;
    const { errorCount, hasError, hasRecoveredFromContinuedErrors } = this.state;

    if (!hasError) {
      return children;
    }

    const { blocks, isValid, validEditorState } = validateBlocks(editorState);

    if (isValid && errorCount < MAX_ERROR_COUNT) {
      this.restoreBlocksmith(validEditorState, false);
      return null;
    }

    let warning = 'The editor is experiencing continued failures.';
    if (isValid) {
      warning += ' The blocks are valid but some issue is causing it to crash.';
    } else {
      warning += ' Some of the blocks are invalid and that may be causing it to crash.';
    }
    warning += ' Press one of the buttons below to restore the editor.';

    return (
      <div className="blocksmith-error-boundary">
        <p>{warning}</p>
        <Button
          // className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
          onClick={() => this.restoreBlocksmith(validEditorState)}
          size="md"
        >
          {`restore editor${isValid ? '' : ' (only valid blocks)'}`}
        </Button>
        {!isValid && (
        <Button
                  // className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
          onClick={() => this.restoreBlocksmith(editorState)}
          size="md"
        >
          restore editor (including invalid blocks)
        </Button>
        )}
        <p>If you continue to see this message, then we recommend that you restore the valid blocks, save, and continue working in a new tab. Please do not close this tab - support will want to examine it to investigate the error.</p>
        {!isValid && (
          <p>The invalid blocks are styled in <span style={{ color: 'red' }}>red</span> below.</p>
        )}
        {blocks.map(({ block, type }) => {
          if (type === 'content') {
            return (
              <div className="preview-component preview-component_error">
                <p>invalid block!</p>
                <p>{`type: ${block.toString()}`}</p>
              </div>
            );
          }
          const message = block.schema().getId().getCurie().getMessage();
          let Component = null;
          switch (message) {
            case 'text-block':
              Component = () => <div dangerouslySetInnerHTML={{ __html: block.get('text') }} />;
              break;
            case 'image-block':
              Component = () => (
                <>
                  <p>{message}</p>
                  <img src={damUrl(block.get('node_ref'), 'o', 'xs')} alt="thumbnail" />
                </>
              );
              break;
            case 'document-block':
              Component = () => (
                <>
                  <p>{message}</p>
                  <img src={damUrl(block.get('image_ref'), 'o', 'xs')} alt="thumbnail" />
                </>
              );
              break;
            case 'gallery-block':
              Component = () => (
                <>
                  <p>{message}</p>
                  <img src={damUrl(block.get('poster_image_ref', getNode(block.get('node_ref')).get('image_ref')), 'o', 'xs')} alt="thumbnail" />
                </>
              );
              break;
            case 'video-block':
              Component = () => (
                <>
                  <p>{message}</p>
                  <img src={damUrl(block.get('poster_image_ref', getNode(block.get('node_ref')).get('image_ref')), 'o', 'xs')} alt="thumbnail" />
                </>
              );
              break;
            default:
              Component = () => <p>{message}</p>;
          }
          return (
            <div className="preview-component">
              <Component />
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(selector, delegate)(ErrorBoundary);
