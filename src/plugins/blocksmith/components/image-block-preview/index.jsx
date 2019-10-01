import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';

const Img = ({ imageNode }) => (
  <div>
    <img src={imageNode ? damUrl(imageNode, 'o', 'md') : ''} alt="thumbnail" />
  </div>
);

Img.propTypes = {
  imageNode: PropTypes.instanceOf(Message),
};

Img.defaultProps = {
  imageNode: null,
};

const ImageBlockPreview = ({
  block,
  className,
  imageNode,
}) => (
  <div
    className={classNames('block-preview-image', className)}
    role="presentation"
  >
    {
      block.has('url')
        ? (
          <a
            className="image-holder"
            href={block.get('url')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Img block={block} imageNode={imageNode} />
          </a>
        )
        : (
          <div className="image-holder">
            <Img block={block} imageNode={imageNode} />
          </div>
        )
    }
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
