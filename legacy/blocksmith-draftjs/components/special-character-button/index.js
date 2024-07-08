import React from 'react';
import { Button } from 'reactstrap';
import Icon from '@triniti/cms/components/icon/index.js';
import UncontrolledTooltip from '@triniti/cms/components/uncontrolled-tooltip/index.js';

export default function SpecialCharacterButton({
  onToggleSpecialCharacterModal: handleToggleSpecialCharacterModal,
}) {
  return (
    <>
      <Button
        className="rounded-circle"
        color="light"
        id="button-special-character"
        onClick={handleToggleSpecialCharacterModal}
        onMouseDown={(e) => e.preventDefault()}
        size="sm"
      >
        <Icon imgSrc="activity" alt="special character" />
      </Button>
      <UncontrolledTooltip placement="left" target="button-special-character">
        Special Character
      </UncontrolledTooltip>
    </>
  );
};
