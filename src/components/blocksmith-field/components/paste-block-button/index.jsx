import React from 'react';
import { Button } from 'reactstrap';
import Icon from 'components/icon';
import UncontrolledTooltip from 'components/uncontrolled-tooltip';

export default function PasteButton({ onPasteBlock: handlePasteBlock }) {
  return (
    <>
      <Button
        className="rounded-circle btn--paste-block"
        color="light"
        id="button-paste-block"
        onClick={handlePasteBlock}
        onMouseDown={(e) => e.preventDefault()}
        size="sm"
      >
        <Icon imgSrc="documents" alt="paste block" />
      </Button>
      <UncontrolledTooltip placement="left" target="button-paste-block">
        Paste
      </UncontrolledTooltip>
    </>
  );
};
