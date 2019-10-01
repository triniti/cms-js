import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const UnlinkButton = ({ onUnlinkAsset }) => [
  <Button
    id="media-unlink-button"
    key="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onUnlinkAsset}
    outlineText
    radius="circle"
    size="sm"
  >
    <Icon imgSrc="unlink" alt="unlink media" />
  </Button>,
  <UncontrolledTooltip key="tooltip" placement="top" target="media-unlink-button">Unlink</UncontrolledTooltip>,
];

UnlinkButton.propTypes = {
  onUnlinkAsset: PropTypes.func.isRequired,
};

export default UnlinkButton;
