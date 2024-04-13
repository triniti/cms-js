import React from 'react';
import { Button } from 'reactstrap';
import Icon from '@triniti/cms/components/icon';
import UncontrolledTooltip from '@triniti/cms/components/uncontrolled-tooltip';

export default function EditBlockButton({ onEdit: handleEdit }) {
  return (
    <>
      <Button
        className="rounded-circle"
        color="light"
        id="button-edit-block"
        onClick={handleEdit}
        onMouseDown={(e) => e.preventDefault()}
        size="sm"
      >
        <Icon imgSrc="pencil" alt="update block" />
      </Button>
      <UncontrolledTooltip placement="top" target="button-edit-block">Update</UncontrolledTooltip>
    </>
  );
};
