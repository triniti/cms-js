import React from 'react';
import classNames from 'classnames';
import ReactStepper from 'react-stepper-horizontal';
import '@triniti/cms/components/blocksmith-field/components/stepper/styles.scss';

export default function Stepper({
  activeColor,
  circleFontSize,
  circleTop,
  className,
  completeBarColor,
  completeColor,
  defaultBarColor,
  defaultColor,
  defaultTitleColor,
  fullWidth,
  horizontal,
  size,
  titleFontSize,
  ...attributes
}) {
  const classes = classNames(
    className,
    'stepper-container',
    {
      'stepper-fullwidth': fullWidth,
      'stepper-horizontal': horizontal,
    },
  );

  return (
    <div className={classes}>
      <ReactStepper
        activeColor={activeColor}
        circleFontSize={circleFontSize}
        circleTop={circleTop}
        completeBarColor={completeBarColor}
        completeColor={completeColor}
        defaultBarColor={defaultBarColor}
        defaultColor={defaultColor}
        defaultTitleColor={defaultTitleColor}
        size={size}
        titleFontSize={titleFontSize}
        {...attributes}
      />
    </div>
  );
};
