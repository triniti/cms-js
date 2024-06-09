import Icon from '@triniti/cms/components/icon/index.js';
import React from 'react';
import '@triniti/cms/components/blocksmith-field/components/generic-block-placeholder/styles.scss';

export default function ImagePreview({ draggable, onDismissImagePreview: handleDismissImagePreview, src }) {
  return (
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
};
