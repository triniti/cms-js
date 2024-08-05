import React from 'react';
import { useSelector } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import getCollaborators from '@triniti/cms/plugins/raven/selectors/getCollaborators.js';
import WarningModal from '@triniti/cms/plugins/raven/components/collaborators/WarningModal.js';

function UserAvatar(props) {
  const { nodeRef } = props;
  const { node } = useNode(nodeRef);

  let initials = '??';
  let title = nodeRef;

  if (node) {
    title = node.get('title') || `${node.get('first_name', '')} ${node.get('last_name', '')}`;
    const first = node.get('first_name', '').substr(0, 1).toUpperCase();
    const last = node.get('last_name', '').substr(0, 1).toUpperCase();

    initials = `${first}${last}`;
    if (initials.length < 1) {
      initials = title.substring(0, 2).toUpperCase();
    }
  }

  const target = `initials-${nodeRef.replaceAll(':', '_')}`;

  return (
    <>
      <span id={target} className="avatar-initials avatar-initials-sm badge-indicator">
        {initials}
      </span>
      <UncontrolledTooltip placement="top" target={target}>
        {title}
      </UncontrolledTooltip>
    </>
  );
}

export default function Collaborators(props) {
  const { nodeRef, editMode = false, onPermalink = false, viewModeUrl = null } = props;
  const users = useSelector((state) => getCollaborators(state, nodeRef));

  return (
    <div className={onPermalink ? 'screen-primary-actions-collaborators' : ''}>
      {Object.keys(users).map((ref) => <UserAvatar key={ref} nodeRef={ref} ts={users[ref]} />)}
      {onPermalink && editMode && (
        <div style={{ position: 'fixed', bottom: 0, right: 0, width: '1px' }}>
          <WarningModal nodeRef={nodeRef} users={users} viewModeUrl={viewModeUrl} />
        </div>
      )}
    </div>
  );
}
