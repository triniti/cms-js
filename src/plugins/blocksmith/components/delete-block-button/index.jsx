import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const DeleteButton = ({ onDelete: handleDelete }) => ([
  <Button
    id="button-delete-block"
    key="button"
    onClick={handleDelete}
    onMouseDown={(e) => e.preventDefault()}
    outlineText
    radius="circle"
    size="sm"
  >
    <Icon imgSrc="trash" alt="delete block" />
  </Button>,
  <UncontrolledTooltip
    key="tooltip"
    placement="top"
    target="button-delete-block"
  >
    Delete
  </UncontrolledTooltip>,
]);

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;
