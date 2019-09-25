import React from 'react';
import PropTypes from 'prop-types';

const SelectThumbnail = ({
  alt, path, style, size, className,
}) => (
  <img
    alt={alt}
    style={style}
    src={path}
    height={size}
    width={size}
    className={className}
  />
);

SelectThumbnail.propTypes = {
  path: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.shape({}),
};

SelectThumbnail.defaultProps = {
  size: 37,
  path: '',
  className: '',
  style: null,
  alt: 'thumbnail',
};


export default SelectThumbnail;
