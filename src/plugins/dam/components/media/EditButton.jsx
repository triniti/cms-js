import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const UnlinkButton = ({ onEditAsset }) => [
  <Button
    id="media-edit-button"
    key="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onEditAsset}
    outlineText
    radius="circle"
    size="sm"
  >
    <Icon imgSrc="edit" alt="edit media" />
  </Button>,
  <UncontrolledTooltip key="tooltip" placement="top" target="media-edit-button">Edit</UncontrolledTooltip>,
];

UnlinkButton.propTypes = {
  onEditAsset: PropTypes.func.isRequired,
};

export default UnlinkButton;
