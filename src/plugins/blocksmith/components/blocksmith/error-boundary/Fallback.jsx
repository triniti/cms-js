import { ContentBlock } from 'draft-js';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
} from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';

import './styles.scss';

const getWarningMsg = (isValid) => {
  let warning = 'The editor is experiencing continued failures.';
  if (isValid) {
    warning += ' The blocks are valid but some issue is causing it to crash.';
  } else {
    warning += ' Some of the blocks are invalid and that may be causing it to crash.';
  }
  warning += ' Press one of the buttons below to restore the editor.';
  return warning;
};

const Fallback = ({
  blocks,
  getNode,
  isValid,
  onRestoreAllBlocks: handleRestoreAllBlocks,
  onRestoreValidBlocks: handleRestoreValidBlocks,
  wordCount,
}) => (
  <Card>
    <CardHeader>
      Content
      <kbd
        className="text-dark bg-white text-uppercase"
        style={{ fontFamily: 'inherit', fontSize: '15px' }}
      >
        <span style={{ fontSize: '11px' }}>Word Count</span>
        <Badge color="light" className="ml-1 font-weight-normal" style={{ fontSize: '11.25px' }}>
          {wordCount}
        </Badge>
      </kbd>
    </CardHeader>
    <CardBody indent>
      <div className="blocksmith-error-boundary">
        <p className="warning">{getWarningMsg(isValid)}</p>
        <Button
          size="md"
          onClick={handleRestoreValidBlocks}
        >
          {`restore editor${isValid ? '' : ' (only valid blocks)'}`}
        </Button>
        {!isValid && (
          <Button size="md" onClick={handleRestoreAllBlocks}>
            restore editor (including invalid blocks)
          </Button>
        )}
        <p>
          If you continue to see this message, then we recommend
          that you restore the valid blocks, save, and continue working
          in a new tab. Please do not close this tab - support will want
          to examine it to investigate the error.
        </p>
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
    </CardBody>
  </Card>
);

Fallback.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  getNode: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  onRestoreAllBlocks: PropTypes.func.isRequired,
  onRestoreValidBlocks: PropTypes.func.isRequired,
  wordCount: PropTypes.number.isRequired,
};

export default Fallback;
