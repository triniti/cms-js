import React from 'react';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import Icon from '@triniti/cms/components/icon/index.js';

export default function ActionButton(props) {
  const { className = '', icon = '', iconUrl = '', text = 'Click', ...rest } = props;
  const classes = classNames(className, 'btn-action');

  return (
    <Button {...rest} className={classes}>
      {(iconUrl || icon) && <Icon imgSrc={icon} src={iconUrl} alt={text} />}
      {text}
    </Button>
  );
}
