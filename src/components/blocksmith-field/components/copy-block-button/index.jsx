import React from 'react';
import { Button } from 'reactstrap';
import Icon from '@triniti/cms/components/icon';
import UncontrolledTooltip from '@triniti/cms/components/uncontrolled-tooltip';

export default function CopyBlockButton({ buttonText, onCopyBlock: handleCopyBlock }) {
  return (
    <>
      <Button
        className="rounded-circle"
        color="light"
        id="button-copy-block"
        onClick={handleCopyBlock}
        onMouseDown={(e) => e.preventDefault()}
        size="sm"
      >
        <Icon imgSrc="clipboard" alt="copy block" />
      </Button>
      <UncontrolledTooltip placement="left" target="button-copy-block">
        {buttonText}
      </UncontrolledTooltip>
    </>
  )
};
