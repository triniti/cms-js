import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const SpecialCharacterButton = ({
  onToggleSpecialCharacterModal: handleToggleSpecialCharacterModal,
}) => (
  <>
    <Button
      id="button-special-character"
      onClick={handleToggleSpecialCharacterModal}
      onMouseDown={(e) => e.preventDefault()}
      outlineText
      radius="circle"
      size="sm"
    >
      <Icon imgSrc="activity" alt="special character" />
    </Button>
    <UncontrolledTooltip placement="left" target="button-special-character">
      Special Character
    </UncontrolledTooltip>
  </>
);

SpecialCharacterButton.propTypes = {
  onToggleSpecialCharacterModal: PropTypes.func.isRequired,
};

export default SpecialCharacterButton;
