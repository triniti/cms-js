import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const CopyButton = ({ buttonText, onCopyBlock: handleCopyBlock }) => (
  <>
    <Button
      id="button-copy-block"
      onClick={handleCopyBlock}
      onMouseDown={(e) => e.preventDefault()}
      outlineText
      radius="circle"
      size="sm"
    >
      <Icon imgSrc="clipboard" alt="copy block" />
    </Button>
    <UncontrolledTooltip placement="left" target="button-copy-block">
      {buttonText}
    </UncontrolledTooltip>
  </>
);

CopyButton.propTypes = {
  buttonText: PropTypes.string,
  onCopyBlock: PropTypes.func.isRequired,
};

CopyButton.defaultProps = {
  buttonText: 'Copy',
};

export default CopyButton;
