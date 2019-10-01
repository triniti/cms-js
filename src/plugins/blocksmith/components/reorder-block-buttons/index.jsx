import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

import { handleDragEnd, handleDragStart } from '../../utils';
import constants from '../blocksmith/constants';

const ReorderButtons = ({
  activeBlockKey,
  areShiftButtonsVisible,
  isFirstBlock,
  isLastBlock,
  onShiftBlock: handleShiftBlock,
  onHideShiftButtons: handleHideShiftButtons,
  onShowShiftButtons: handleShowShiftButtons,
}) => {
  const className = classNames('mb-1 btn btn-outline-text-light btn-light btn-sm btn-radius-circle', { 'mr-2': !areShiftButtonsVisible });
  return isFirstBlock && isLastBlock ? null : (
    <div className="d-inline-flex align-items-center flex-column">
      <Button
        className="mb-1"
        disabled={isFirstBlock || !areShiftButtonsVisible}
        id="button-shift-block-up"
        key="b1"
        onClick={() => handleShiftBlock('up')}
        onMouseEnter={handleShowShiftButtons}
        onMouseLeave={() => handleHideShiftButtons()}
        outlineText
        radius="circle"
        size="xxs"
        style={{ transform: 'rotate(90deg)', opacity: areShiftButtonsVisible && !isFirstBlock ? 1 : 0 }}
      >
        <Icon imgSrc="arrow-back" alt="move block up one position" size="xxs" />
      </Button>
      {
        areShiftButtonsVisible && !isFirstBlock
        && (
          <UncontrolledTooltip
            disabled={isFirstBlock || !areShiftButtonsVisible}
            key="t1"
            placement="top"
            target="button-shift-block-up"
          >
            Move up
          </UncontrolledTooltip>
        )
      }
      {[
        <span
          className={className}
          data-dragged-block-key={activeBlockKey}
          draggable
          id={constants.DRAG_BUTTON_ID}
          key="b2"
          onDragStart={handleDragStart(activeBlockKey)}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleShowShiftButtons}
          onMouseLeave={() => handleHideShiftButtons(750)}
          role="button"
          tabIndex={-1}
        >
          <Icon imgSrc="insert" alt="drag block" />
        </span>,
        <UncontrolledTooltip
          key="t2"
          placement="right"
          target={constants.DRAG_BUTTON_ID}
        >
          Reorder
        </UncontrolledTooltip>,
      ]}
      <Button
        className="mr-2"
        disabled={isLastBlock || !areShiftButtonsVisible}
        id="button-shift-block-down"
        key="b3"
        onClick={() => handleShiftBlock('down')}
        onMouseEnter={handleShowShiftButtons}
        onMouseLeave={() => handleHideShiftButtons()}
        outlineText
        radius="circle"
        size="xxs"
        style={{ transform: 'rotate(90deg)', opacity: areShiftButtonsVisible && !isLastBlock ? 1 : 0 }}
      >
        <Icon imgSrc="arrow-forward" alt="move block down one position" size="xxs" />
      </Button>
      {
        areShiftButtonsVisible && !isLastBlock
        && (
          <UncontrolledTooltip
            disabled={isLastBlock || !areShiftButtonsVisible}
            key="t3"
            placement="bottom"
            target="button-shift-block-down"
          >
            Move down
          </UncontrolledTooltip>
        )
      }
    </div>
  );
};

ReorderButtons.propTypes = {
  activeBlockKey: PropTypes.string,
  areShiftButtonsVisible: PropTypes.bool.isRequired,
  isFirstBlock: PropTypes.bool.isRequired,
  isLastBlock: PropTypes.bool.isRequired,
  onShiftBlock: PropTypes.func.isRequired,
  onHideShiftButtons: PropTypes.func.isRequired,
  onShowShiftButtons: PropTypes.func.isRequired,
};

ReorderButtons.defaultProps = {
  activeBlockKey: '',
};

export default ReorderButtons;
