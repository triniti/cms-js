import React from 'react';
import { Button, Input } from 'reactstrap';
import { Icon } from 'components';

const ResizeGallerySlider = ({
  imagesPerRow = 6,
  maxImagesPerRow = 11,
  minImagesPerRow = 1,
  onIncreaseImagesPerRow,
  onDecreaseImagesPerRow,
  onSlideImagesPerRow,
}) => (
  <div className="resize-gallery-slider d-inline-flex align-items-center" style={{ width: '10rem' }}>
    <Button
      className="rounded-circle"
      disabled={imagesPerRow === maxImagesPerRow}
      onClick={onIncreaseImagesPerRow}
      size="xs"
      color="light"
    >
      <Icon size="xxs" color="dark" imgSrc="minus" />
    </Button>
    <Input
      type="range"
      min={minImagesPerRow}
      max={maxImagesPerRow}
      step="1"
      style={{ direction: 'rtl', paddingRight: '10px' }}
      value={imagesPerRow}
      onChange={onSlideImagesPerRow}
      color="light"
    />
    <Button
      disabled={imagesPerRow === minImagesPerRow}
      onClick={onDecreaseImagesPerRow}
      className="ml-2 rounded-circle"
      size="xs"
      color="light"
    >
      <Icon size="xxs" color="dark" imgSrc="plus" />
    </Button>
  </div>
);

export default ResizeGallerySlider;