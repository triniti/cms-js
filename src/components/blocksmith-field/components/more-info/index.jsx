import React, { useState } from 'react';
import Icon from '@triniti/cms/components/icon';
import { Collapse, Label } from 'reactstrap';

export default function MoreInfo ({
  label = 'More Info',
  children,
}) {
  const [ isOpen, setIsOpen ] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="pt-1">
      <Label onClick={toggle}>
        {!isOpen && <Icon imgSrc="arrow-right" alt="Open" size="xxs" className="me-1" />}
        {isOpen && <Icon imgSrc="arrow-down" alt="Close" size="xxs" className="me-1" />}
        {label}
      </Label>
      <Collapse isOpen={isOpen} className="border p-2">
          {children}
      </Collapse>
    </div>
  );
}