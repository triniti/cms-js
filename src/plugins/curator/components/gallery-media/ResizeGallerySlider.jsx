import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from '@triniti/admin-ui-plugin/components';

const ResizeGallerySlider = ({
  imagesPerRow,
  maxImagesPerRow,
  minImagesPerRow,
  onIncreaseImagesPerRow,
  onDecreaseImagesPerRow,
  onSlideImagesPerRow,
}) => (
  <div className="resize-gallery-slider d-inline-flex" style={{ width: '10rem' }}>
    <Button
      disabled={imagesPerRow === maxImagesPerRow}
      onClick={onIncreaseImagesPerRow}
      radius="circle"
      size="xs"
    >
      <Icon size="xxs" color="dark" imgSrc="minus" />
    </Button>
    <Input
      type="range"
      min={minImagesPerRow}
      max={maxImagesPerRow}
      step="1"
      style={{ direction: 'rtl' }}
      value={imagesPerRow}
      onChange={onSlideImagesPerRow}
    />
    <Button
      disabled={imagesPerRow === minImagesPerRow}
      onClick={onDecreaseImagesPerRow}
      className="ml-2"
      radius="circle"
      size="xs"
    >
      <Icon size="xxs" color="dark" imgSrc="plus" />
    </Button>
  </div>
);

ResizeGallerySlider.propTypes = {
  imagesPerRow: PropTypes.number,
  maxImagesPerRow: PropTypes.number,
  minImagesPerRow: PropTypes.number,
  onIncreaseImagesPerRow: PropTypes.func.isRequired,
  onDecreaseImagesPerRow: PropTypes.func.isRequired,
  onSlideImagesPerRow: PropTypes.func.isRequired,
};

ResizeGallerySlider.defaultProps = {
  imagesPerRow: 6,
  maxImagesPerRow: 11,
  minImagesPerRow: 1,
};

export default ResizeGallerySlider;
