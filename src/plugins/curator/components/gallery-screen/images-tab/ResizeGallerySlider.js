import React from 'react';
import { Button, Input } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';

const ResizeGallerySlider = ({
  imagesPerRow,
  maxImagesPerRow,
  minImagesPerRow = 1,
  onIncreaseImagesPerRow,
  onDecreaseImagesPerRow,
  onSlideImagesPerRow,
}) => (
  <div className="resize-gallery-slider d-inline-flex align-items-center" style={{ width: '15rem' }}>
    <Button
      disabled={imagesPerRow === maxImagesPerRow}
      onClick={onIncreaseImagesPerRow}
      className="rounded-circle"
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
      className="rounded-circle"
      size="xs"
      color="light"
    >
      <Icon size="xxs" color="dark" imgSrc="plus" />
    </Button>
  </div>
);

export default ResizeGallerySlider;