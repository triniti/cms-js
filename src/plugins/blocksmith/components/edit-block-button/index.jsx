import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const EditButton = ({ onEdit: handleEdit }) => (
  <>
    <Button
      id="button-edit-block"
      onClick={handleEdit}
      onMouseDown={(e) => e.preventDefault()}
      outlineText
      radius="circle"
      size="sm"
    >
      <Icon imgSrc="pencil" alt="update block" />
    </Button>
    <UncontrolledTooltip placement="top" target="button-edit-block">
    Update
    </UncontrolledTooltip>
  </>
);

EditButton.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

export default EditButton;
