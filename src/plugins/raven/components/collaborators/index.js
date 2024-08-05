import React from 'react';
import { useSelector } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import { formatDistanceToNow } from 'date-fns';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import getCollaborators from '@triniti/cms/plugins/raven/selectors/getCollaborators.js';

function UserAvatar(props) {
  const { nodeRef, ts } = props;
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
  const active = formatDistanceToNow(ts * 1000, { includeSeconds: true });

  return (
    <>
      <span id={target} className="avatar-initials avatar-initials-sm badge-indicator">
        {initials}
      </span>
      <UncontrolledTooltip placement="top" target={target}>
        {title}<br/>({active} ago)
      </UncontrolledTooltip>
    </>
  );
}

export default function Collaborators(props) {
  const { nodeRef, editMode } = props;
  const users = useSelector((state) => getCollaborators(state, nodeRef));

  return (
    <div className="screen-primary-actions-collaborators">
      {Object.keys(users).map((ref) => <UserAvatar key={ref} nodeRef={ref} ts={users[ref]} />)}
    </div>
  );
}
