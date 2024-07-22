import React, { useState } from 'react';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import Icon from '@triniti/cms/components/icon/index.js';

export default function PrimaryActions(props) {
  const [isActive, setIsActive] = useState(false);
  const toggle = () => setIsActive(!isActive);

  const classes = classNames(
    'screen-primary-actions',
    'fade',
    isActive ? 'show' : 'hide',
  );

  return (
    <div className="screen-primary-actions-wrapper">
      <Button color="primary" className="btn-primary-actions-toggle" onClick={toggle}>
        <Icon imgSrc="status" className="me-0" size="md" />
      </Button>
      <div className={classes}>
        <div className="screen-primary-actions-body">
          <div className="screen-primary-actions-close" onClick={toggle} />
          {props.children}
        </div>
      </div>
    </div>
  );
}
