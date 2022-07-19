import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const Example = ({ children, ...rest}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Tooltip isOpen={isOpen} toggle={toggle} delay={{ show: 250, hide: 0 }} {...rest}>
      {children}
    </Tooltip>
  );
}

export default Example;
