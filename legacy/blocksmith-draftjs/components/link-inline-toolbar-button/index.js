import React from 'react';
import classNames from 'classnames';
import Icon from '@triniti/cms/components/icon/index.js';
import { entityTypes } from '@triniti/cms/blocksmith/constants.js';
import { hasEntity } from '@triniti/cms/blocksmith/utils/index.js';

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
