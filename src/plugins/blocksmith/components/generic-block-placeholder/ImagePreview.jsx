import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@triniti/admin-ui-plugin/components';

import './styles.scss';

const ImagePreview = ({ onDismissImagePreview: handleDismissImagePreview, src }) => (
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
      <img src={src} alt="" />
    </div>
  </div>
);

ImagePreview.propTypes = {
  onDismissImagePreview: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};

export default ImagePreview;
