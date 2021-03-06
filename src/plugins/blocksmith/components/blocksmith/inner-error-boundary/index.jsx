import { Button } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import { ContentBlock, EditorState } from 'draft-js';
import blockParentNode from '@triniti/cms/plugins/blocksmith/utils/blockParentNode';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import PropTypes from 'prop-types';
import React from 'react';
import validateBlocks from '@triniti/cms/plugins/blocksmith/utils/validateBlocks';
import selector from './selector';
import './styles.scss';

const MAX_ERROR_COUNT = 5;

class InnerErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    getNode: PropTypes.func.isRequired,
    onDirtyEditor: PropTypes.func.isRequired,
    onStoreEditor: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      errorCount: 0,
      hasError: false,
    };

    this.restoreBlocksmith = this.restoreBlocksmith.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    window.onerror(error);
  }

  restoreBlocksmith(editorState, resetErrorCount = true) {
    const { onStoreEditor: handleStoreEditor } = this.props;
    this.setState(({ errorCount }) => ({
      errorCount: resetErrorCount ? 0 : errorCount + 1,
      hasError: false,
    }), () => {
      blockParentNode.clearCache();
      handleStoreEditor(editorState);
    });
  }

  render() {
    const {
      children,
      editorState,
      getNode,
      onDirtyEditor: handleDirtyEditor,
    } = this.props;
    const { errorCount, hasError } = this.state;

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
    warning += ` Press ${isValid ? 'the button' : 'one of the buttons'} below to restore the editor.`;

    return (
      <div className="blocksmith-error-boundary">
        <p className="warning">{warning}</p>
        <Button
          size="md"
          onClick={() => {
            this.restoreBlocksmith(validEditorState);
            handleDirtyEditor();
          }}
        >
          {`restore editor${isValid ? '' : ' (only valid blocks)'}`}
        </Button>
        {!isValid && (
        <Button size="md" onClick={() => this.restoreBlocksmith(editorState)}>
          restore editor (including invalid blocks)
        </Button>
        )}
        <p>If you continue to see this message, then we recommend that you restore the valid blocks, save, and continue working in a new tab. Please do not close this tab - support will want to examine it to investigate the error.</p>
        {!isValid && (
          <p>The invalid blocks are styled in <span className="invalid-block-indicator"><strong>red</strong></span> below.</p>
        )}
        <hr />
        {blocks.map(({ block }) => {
          if (block instanceof ContentBlock) {
            let message = 'block';
            const blockData = block.getData();
            if (blockData && blockData.has('canvasBlock')) {
              message = blockData.get('canvasBlock').schema().getCurie().getMessage();
            }
            return (
              <div className="preview-component preview-component__error" key={block.getKey()}>
                <p><strong>{`invalid ${message}`}</strong></p>
                <p>{block.toString()}</p>
              </div>
            );
          }
          const message = block.schema().getCurie().getMessage();
          let Component;
          switch (message) {
            case 'text-block':
              // eslint-disable-next-line react/no-danger
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
            <div className="preview-component" key={block.get('etag', block.generateEtag())}>
              <Component />
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(selector)(InnerErrorBoundary);
