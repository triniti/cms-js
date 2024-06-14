import React from 'react';
import classNames from 'classnames';
import '@triniti/cms/components/background-image/styles.scss';

const BackgroundImage = ({ className, imgSrc, position, repeat, size, tag: Tag = 'span', ...attributes }) => {
  const classes = classNames(
    className,
    'background-image',
  );

  return <Tag {...attributes} className={classes} style={{ backgroundImage: `url(${imgSrc})`, backgroundPosition: `${position}`, backgroundSize: `${size}`, backgroundRepeat: `${repeat}` }} />;
};

export default BackgroundImage;
