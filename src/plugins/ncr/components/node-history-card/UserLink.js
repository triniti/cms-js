import React from 'react';
import { Link } from 'react-router-dom';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default function UserLink({ userRef }) {
  const nodeRef = userRef ? NodeRef.fromMessageRef(userRef) : null;
  const { node: user } = useNode(nodeRef);

  if (!user) {
    return 'SYSTEM';
  }

  return <Link to={nodeUrl(user, 'view')}>{user.get('title') || user.get('email')}</Link>;
}
