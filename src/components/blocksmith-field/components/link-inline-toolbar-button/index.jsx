import React from 'react';
import classNames from 'classnames';
import Icon from 'components/icon';
import { entityTypes } from 'components/blocksmith-field/constants';
import { hasEntity } from 'components/blocksmith-field/utils';

export default function LinkButton({ getEditorState, onToggleLinkModal }) {
  return (
    <div
      className="inline-toolbar-button-wrapper"
      onMouseDown={(e) => e.preventDefault()}
      role="presentation"
    >
      <button
        className={classNames('inline-toolbar-button', { 'inline-toolbar-button-active': hasEntity(getEditorState(), entityTypes.LINK) })}
        onClick={onToggleLinkModal}
        type="button"
      >
        <Icon imgSrc="link" alt="link" />
      </button>
    </div>
  );
};
