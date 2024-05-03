import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import getNode from 'plugins/ncr/selectors/getNode';
import nodeUrl from 'plugins/ncr/nodeUrl';

export default function UserLink({ userRef }) {
  const user = useSelector((state) => {
    return userRef ? getNode(state, NodeRef.fromMessageRef(userRef)) : null;
  });

  if (!user) {
    return 'SYSTEM';
  }

  return <Link to={nodeUrl(user, 'view')}>{user.get('title') || user.get('email')}</Link>
}
