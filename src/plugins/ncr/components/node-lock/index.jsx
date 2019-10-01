import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { ActionButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';

import delegateFactory from './delegate';
import selector from './selector';

export const NodeLock = ({
  canLock,
  canUnlock,
  delegate,
  lockButtonText,
  node,
  unlockButtonText,
}) => {
  if (!node) {
    return null;
  }

  const isLocked = node.get('is_locked');

  if (isLocked && !canUnlock) {
    return (
      <Redirect
        to={delegate.handleRedirect() || ''}
      />
    );
  }

  if (!isLocked && canLock) {
    return (
      <ActionButton
        icon="locked-solid"
        text={lockButtonText}
        onClick={() => delegate.handleLock(lockButtonText)}
      />
    );
  }

  if (isLocked && canUnlock) {
    return (
      <ActionButton
        icon="unlocked-solid"
        text={unlockButtonText}
        onClick={() => delegate.handleUnlock(unlockButtonText)}
      />
    );
  }

  return null;
};

NodeLock.propTypes = {
  canLock: PropTypes.bool,
  canUnlock: PropTypes.bool,
  delegate: PropTypes.shape({
    handleLock: PropTypes.func.isRequired,
    handleUnlock: PropTypes.func.isRequired,
    handleRedirect: PropTypes.func.isRequired,
  }).isRequired,
  lockButtonText: PropTypes.string,
  node: PropTypes.instanceOf(Message),
  unlockButtonText: PropTypes.string,
};

NodeLock.defaultProps = {
  canLock: false,
  canUnlock: false,
  lockButtonText: 'Lock',
  node: null,
  unlockButtonText: 'Unlock',
};

export default connect(selector, createDelegateFactory(delegateFactory))(NodeLock);
