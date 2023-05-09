import classNames from 'classnames';
import React from 'react';
import damUrl from 'plugins/dam/damUrl';
import './styles.scss';

const ImageBlockPreview = ({
  block,
  className = '',
  imageNode = null,
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


export default ImageBlockPreview;