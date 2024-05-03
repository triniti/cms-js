import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default function UserLink({ userRef }) {
  const user = useSelector((state) => {
    return userRef ? getNode(state, NodeRef.fromMessageRef(userRef)) : null;
  });

  if (!user) {
    return 'SYSTEM';
  }

  return <Link to={nodeUrl(user, 'view')}>{user.get('title') || user.get('email')}</Link>
}
