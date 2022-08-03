import React from 'react';
import { Alert } from 'reactstrap';
import Icon from 'components/icon';

export default function ViewModeWarning() {
  return (
    <Alert color="warning" className="alert-inverse">
      <span><Icon imgSrc="warning-outline" /> {'You\'re in'} <strong>View Mode</strong></span>
    </Alert>
  );
}
