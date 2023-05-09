import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Icon } from 'components';
import damUrl from 'plugins/dam/damUrl';
import selector from './selector';
import './styles.scss';


const GalleryBlockPreview = ({
  block,
  className = '',
  galleryNode,
  handleGetNode,
  imageNode = null,
}) => {

  useEffect(() => {
    if (!imageNode && (block.has('poster_image_ref') || galleryNode.has('image_ref'))) {
      handleGetNode(block.get('poster_image_ref') || galleryNode.get('image_ref'));
    }
  });

  const imgSrc = imageNode ? `${damUrl(imageNode, 'o', 'md')}` : '';
  return (
    <div
      className={classNames('block-preview-gallery', className)}
      role="presentation"
    >
      <img src={imgSrc} alt="thumbnail" />
      {
          (block.has('launch_text') || galleryNode.has('launch_text'))
          && (
            <div className="launch-text">
              <p>{block.get('launch_text') || galleryNode.get('launch_text')}</p>
              <Icon alert border imgSrc="gallery" size="xs" alt="gallery-icon" />
            </div>
          )
        }
    </div>
  );
}

export default connect(selector)(GalleryBlockPreview);