import { Icon } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

const ImagePreview = ({ draggable, onDismissImagePreview: handleDismissImagePreview, src }) => (
  <div className="mt-2 mb-1 blocksmith-image-preview">
    <div className="img-wrapper">
      <Icon
        alert
        className="rounded-0"
        id="dismiss-preview"
        imgSrc="delete"
        onClick={handleDismissImagePreview}
        outline
        size="xxs"
      />
      <img src={src} alt="" draggable={draggable} />
    </div>
  </div>
);

ImagePreview.propTypes = {
  draggable: PropTypes.bool.isRequired,
  onDismissImagePreview: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};

export default ImagePreview;
