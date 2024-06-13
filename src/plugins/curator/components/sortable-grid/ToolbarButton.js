import React from 'react';
import { Button } from 'reactstrap';
import { Icon, UncontrolledTooltip } from '@triniti/cms/components/index.js';

const ToolbarButton = ({ onMouseDown, icon, id, tooltip }) => (
  <>
    <Button
      target="_blank"
      id={id}
      key={id}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      onClick={(e) => e.preventDefault()}
      size="sm"
      style={{ zIndex: '100000' }}
      color="light"
      className="rounded-circle"
    >
      <Icon imgSrc={icon} />
    </Button>
    <UncontrolledTooltip key={`${id}-tooltip`} placement="top" target={id}>{tooltip}</UncontrolledTooltip>
  </>
);

export default ToolbarButton;
