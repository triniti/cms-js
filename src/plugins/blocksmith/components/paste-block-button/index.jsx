import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const PasteButton = ({ onPasteBlock: handlePasteBlock }) => (
  <>
    <Button
      id="button-paste-block"
      onClick={handlePasteBlock}
      onMouseDown={(e) => e.preventDefault()}
      outlineText
      radius="circle"
      size="sm"
      className="btn--paste-block"
    >
      <Icon imgSrc="documents" alt="paste block" />
    </Button>
    <UncontrolledTooltip placement="left" target="button-paste-block">
      Paste
    </UncontrolledTooltip>
  </>
);

PasteButton.propTypes = {
  onPasteBlock: PropTypes.func.isRequired,
};

export default PasteButton;
