import React from 'react';
import classNames from 'classnames';
import './styles.scss';

const BackgroundImage = ({ className, imgSrc, position, repeat, size, tag: Tag, ...attributes }) => {
  const classes = classNames(
    className,
    'background-image',
  );

  return <Tag {...attributes} className={classes} style={{ backgroundImage: `url(${imgSrc})`, backgroundPosition: `${position}`, backgroundSize: `${size}`, backgroundRepeat: `${repeat}` }} />;
};

export default BackgroundImage;
