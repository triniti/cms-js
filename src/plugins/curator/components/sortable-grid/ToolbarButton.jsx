import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const ToolbarButton = ({ onMouseDown, icon, id, tooltip }) => (
  <>
    <Button
      target="_blank"
      id={id}
      key={id}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      onClick={(e) => e.preventDefault()}
      outlineText
      radius="circle"
      size="sm"
      style={{ zIndex: '100000' }}
    >
      <Icon imgSrc={icon} />
    </Button>
    <UncontrolledTooltip key={`${id}-tooltip`} placement="top" target={id}>{tooltip}</UncontrolledTooltip>
  </>
);

ToolbarButton.propTypes = {
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default ToolbarButton;
