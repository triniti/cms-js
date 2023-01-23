import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.scss';

const BackgroundImage = ({ className, imgSrc, position, repeat, size, tag: Tag, ...attributes }) => {
  const classes = classNames(
    className,
    'background-image',
  );

  return <Tag {...attributes} className={classes} style={{ backgroundImage: `url(${imgSrc})`, backgroundPosition: `${position}`, backgroundSize: `${size}`, backgroundRepeat: `${repeat}` }} />;
};

BackgroundImage.propTypes = {
  className: PropTypes.string,
  imgSrc: PropTypes.string,
  position: PropTypes.string,
  repeat: PropTypes.string,
  size: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

BackgroundImage.defaultProps = {
  imgSrc: '',
  position: 'center center',
  repeat: 'no-repeat',
  size: 'contain',
  tag: 'div',
};

export default BackgroundImage;