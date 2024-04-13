import React from 'react';
import classNames from 'classnames';
import mapNameToIcon from '@triniti/cms/components/icon/mapNameToIcon';

export default function Icon(props) {
  const {
    alert = false,
    border = false,
    className = '',
    color = '',
    imgSrc = 'circle',
    noborder = false,
    outline = false,
    radius = '',
    size = '',
    src = '',
    tag: Tag = 'span',
    toggler = false,
    ...attributes
  } = props;

  const classes = classNames(
    className,
    'icon',
    {
      'icon-alert': alert,
      'icon-border': border,
      'icon-noborder': noborder,
      'icon-outline': outline,
      'icon-toggler': toggler,
    },
    {
      [`icon-alert-${size}`]: alert && !!size,
      [`icon-color-${color}`]: !!color,
      [`icon-radius-${radius}`]: !!radius,
      [`icon-${size}`]: !!size,
    },
  );

  const img = src || mapNameToIcon(imgSrc);
  return <Tag {...attributes} className={classes} dangerouslySetInnerHTML={{ __html: img }} />;
}
