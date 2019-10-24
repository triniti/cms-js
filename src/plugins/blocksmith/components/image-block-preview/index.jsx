import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Message from '@gdbots/pbj/Message';
import selector from './selector';
import './styles.scss';

const ImageBlockPreview = ({
  block,
  className,
  imageNode,
}) => (
  <div className={classNames('block-preview-image', className)} role="presentation">
    {imageNode && (
    <a
      className="image-holder"
      href={block.get('url') || damUrl(imageNode, 'o', 'md')}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={damUrl(imageNode, 'o', 'md')} alt="thumbnail" />
      {block.has('launch_text') && (
      <div className="launch-text">
        <p>{block.get('launch_text')}</p>
      </div>
      )}
    </a>
    )}
  </div>
);

ImageBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  className: PropTypes.string,
  imageNode: PropTypes.instanceOf(Message),
};

ImageBlockPreview.defaultProps = {
  className: '',
  imageNode: null,
};

export default connect(selector)(ImageBlockPreview);
