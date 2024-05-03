import React from 'react';
import { Button } from 'reactstrap';
import Icon from '@triniti/cms/components/icon/index.js';
import UncontrolledTooltip from '@triniti/cms/components/uncontrolled-tooltip/index.js';

export default function DeleteBlockButton({ onDelete: handleDelete }) {
  return (
    <>
      <Button
        className="rounded-circle"
        color="light"
        id="button-delete-block"
        onClick={handleDelete}
        onMouseDown={(e) => e.preventDefault()}
        size="sm"
      >
        <Icon imgSrc="trash" alt="delete block" />
      </Button>
      <UncontrolledTooltip
        placement="top"
        target="button-delete-block"
      >
        Delete
      </UncontrolledTooltip>
    </>
  );
};
