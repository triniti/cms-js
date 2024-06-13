import React from 'react';
import { useSelector } from 'react-redux';
import { Badge, Button, Card, CardBody, CardHeader, Spinner, Table } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import pbjUrl from '@gdbots/pbjx/pbjUrl.js';
import { Icon } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import PublishForm from '@triniti/cms/plugins/ncr/components/node-status-card/PublishForm.js';

export default function NodeStatusCard(props) {
  const { nodeRef } = props;
  const { node, refreshNode, isRefreshing } = useNode(nodeRef);
  const user = useSelector((state) => {
    const userRef = node.get('updater_ref', node.get('creator_ref'));
    return userRef ? getNode(state, NodeRef.fromMessageRef(userRef)) : null;
  });

  if (!node) {
    return null;
  }

  const status = `${node.get('status')}`;
  const handleStatusUpdated = props.onStatusUpdated || refreshNode;
  const isPublishable = node.schema().hasMixin('gdbots:ncr:mixin:publishable');
  const canonicalUrl = pbjUrl(node, 'canonical');
  const previewUrl = pbjUrl(node, 'preview');

  return (
    <Card>
      <CardHeader>
        <span>
          Status <Badge color="dark" pill className={`status-${status}`}>{status}</Badge>
          {isRefreshing && <Spinner />}
        </span>
        <Button color="light" size="sm" onClick={refreshNode} disabled={isRefreshing}>
          <Icon imgSrc="refresh" />
        </Button>
      </CardHeader>

      {(canonicalUrl || previewUrl) && (
        <CardBody className="pt-3 pb-2">
          {canonicalUrl && (
            <a
              href={canonicalUrl}
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              target="_blank"
            >
              <Button color="primary">
                <Icon imgSrc="external" className="me-1" />
                <span>View Permalink</span>
              </Button>
            </a>
          )}
          {previewUrl && (
            <a
              href={previewUrl}
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              target="_blank"
            >
              <Button className="ms-2" color="secondary">
                <Icon imgSrc="external" className="me-1" />
                <span>Preview</span>
              </Button>
            </a>
          )}
        </CardBody>
      )}

      <Table className="border-bottom border-light mb-0">
        <tbody>
        {node.has('published_at') && (
          <tr>
            <th className="nowrap pe-0" scope="row">{status === 'published' ? 'Published At:' : 'Publish At:'}</th>
            <td className="w-100 ps-2">{formatDate(node.get('published_at'))}</td>
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

      {isPublishable && (
        <CardBody className="py-3">
          <PublishForm nodeRef={nodeRef} node={node} onStatusUpdated={handleStatusUpdated} />
        </CardBody>
      )}
    </Card>
  );
}
