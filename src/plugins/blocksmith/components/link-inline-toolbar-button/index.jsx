import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@triniti/admin-ui-plugin/components';
import { hasEntity } from '../../utils';

const LinkButton = ({ getEditorState, onToggleLinkModal }) => (
  <div
    className="inline-toolbar-button-wrapper"
    onMouseDown={(e) => e.preventDefault()}
    role="presentation"
  >
    <button
      className={classNames('inline-toolbar-button', { 'inline-toolbar-button-active': hasEntity(getEditorState(), 'LINK') })}
      onClick={onToggleLinkModal}
      type="button"
    >
      <Icon imgSrc="link" alt="link" />
    </button>
  </div>
);

LinkButton.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  onToggleLinkModal: PropTypes.func.isRequired,
};

export default LinkButton;
