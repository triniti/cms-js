import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { Icon } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';

const DocumentBlockPreview = ({ className, documentNode, imageNode, block }) => (
  <div
    className={classNames('block-preview-document', className)}
    role="presentation"
  >
    <a
      href={damUrl(documentNode)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img src={imageNode ? damUrl(imageNode, 'o', 'md') : ''} alt="thumbnail" />
      {
        block.has('launch_text')
        && (
          <div className="launch-text">
            <p>{block.get('launch_text')}</p>
            <Icon alert border imgSrc="document" size="xs" alt="document-icon" />
          </div>
        )
      }
    </a>
  </div>
);

DocumentBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  className: PropTypes.string,
  documentNode: PropTypes.instanceOf(Message).isRequired,
  imageNode: PropTypes.instanceOf(Message),
};

DocumentBlockPreview.defaultProps = {
  className: '',
  imageNode: null,
};

export default connect(selector)(DocumentBlockPreview);
