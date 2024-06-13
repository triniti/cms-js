import React from 'react';
import { useSelector } from 'react-redux';
import { Badge, Button, Card, CardBody, CardHeader, Spinner, Table } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { Icon } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import SendForm from '@triniti/cms/plugins/notify/components/notification-screen/SendForm.js';

export default function SendStatusCard(props) {
  const { nodeRef } = props;
  const { node, refreshNode, isRefreshing } = useNode(nodeRef);
  const user = useSelector((state) => {
    const userRef = node.get('updater_ref', node.get('creator_ref'));
    return userRef ? getNode(state, NodeRef.fromMessageRef(userRef)) : null;
  });

  if (!node) {
    return null;
  }

  const hasContent = node.has('content_ref');
  const sendStatus = `${node.get('send_status')}`;

  const handleStatusUpdated = props.onStatusUpdated || refreshNode;
  const isSendable = hasContent && sendStatus !== 'cancelled' && sendStatus !== 'failed' && sendStatus !== 'sent';

  return (
    <Card>
      <CardHeader>
        <span>
          Status <Badge color="dark" pill className={`status-${sendStatus}`}>{sendStatus}</Badge>
          {isRefreshing && <Spinner />}
        </span>
        <Button color="light" size="sm" onClick={refreshNode} disabled={isRefreshing}>
          <Icon imgSrc="refresh" />
        </Button>
      </CardHeader>

      <Table className="border-bottom border-light mb-0">
        <tbody>
        {node.has('send_at') && (
          <tr>
            <th className="nowrap pe-0" scope="row">Send At:</th>
            <td className="w-100 ps-2">{formatDate(node.get('send_at'))}</td>
          </tr>
        )}
        {node.has('sent_at') && (
          <tr>
            <th className="nowrap pe-0" scope="row">Sent At:</th>
            <td className="w-100 ps-2">{formatDate(node.get('sent_at'))}</td>
          </tr>
        )}
        <tr>
          <th className="nowrap pe-0" scope="row">Updated At:</th>
          <td className="w-100 ps-2">{formatDate(node.get('updated_at', node.get('created_at')))}</td>
        </tr>
        <tr>
          <th className="nowrap pe-0" scope="row">Updated By:</th>
          <td className="w-100 ps-2">{user ? user.get('title') : 'SYSTEM'}</td>
        </tr>
        </tbody>
      </Table>

      {isSendable && (
        <CardBody className="py-3">
          <SendForm nodeRef={nodeRef} node={node} onStatusUpdated={handleStatusUpdated} />
        </CardBody>
      )}
    </Card>
  );
}
