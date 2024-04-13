import React from 'react';
import classNames from 'classnames';

import { Button } from 'reactstrap';
import Icon from '@triniti/cms/components/icon';
import UncontrolledTooltip from '@triniti/cms/components/uncontrolled-tooltip';

import { handleDragEnd, handleDragStart } from '@triniti/cms/components/blocksmith-field/utils';
import constants from '@triniti/cms/components/blocksmith-field/constants';

export default function ReorderButtons({
  activeBlockKey,
  areShiftButtonsVisible,
  isFirstBlock,
  isLastBlock,
  onShiftBlock: handleShiftBlock,
  onHideShiftButtons: handleHideShiftButtons,
  onShowShiftButtons: handleShowShiftButtons,
}) {
  const className = classNames('mb-1 btn btn-light btn-sm rounded-circle', { 'me-2': !areShiftButtonsVisible });
  return isFirstBlock && isLastBlock ? null : (
    <div className="d-inline-flex align-items-center flex-column">
      <Button
        className="mb-1 rounded-circle"
        color="light"
        disabled={isFirstBlock || !areShiftButtonsVisible}
        id="button-shift-block-up"
        key="b1"
        onClick={() => handleShiftBlock('up')}
        onMouseEnter={handleShowShiftButtons}
        onMouseLeave={() => handleHideShiftButtons()}
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
        className="me-2 rounded-circle"
        color="light"
        disabled={isLastBlock || !areShiftButtonsVisible}
        id="button-shift-block-down"
        key="b3"
        onClick={() => handleShiftBlock('down')}
        onMouseEnter={handleShowShiftButtons}
        onMouseLeave={() => handleHideShiftButtons()}
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
