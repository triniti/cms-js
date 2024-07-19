import React from 'react';
import { Badge, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Icon, Loading } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function SinglePoll(props) {
  const { nodeRef } = props;
  const { node, pbjxError } = useNode(nodeRef);

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return <Loading inline size="sm" error={error}>Loading {nodeRef}...</Loading>;
  }

  const status = node.get('status').getValue();
  const url = nodeUrl(node, 'view');

  return (
    <ListGroupItem key={`${node.get('_id')}`}>
      {node.get('title')}
      <Badge color="dark" size="sm" className={`ms-1 align-self-end status-${status}`}>{status}</Badge>
      <a href={url} className="ms-1" target="_blank">
        <Button color="hover" tag="span" size="sm" className="mb-0 me-0 p-0" style={{ minHeight: 'initial' }}>
          <Icon imgSrc="external" alt="view" />
        </Button>
      </a>
    </ListGroupItem>
  );
}

function PollGridBlockPreview(props) {
  const { block } = props;
  return (
    <ListGroup>
      {block.get('node_refs', []).map(ref => (
        <SinglePoll key={ref.getId()} nodeRef={ref} />
      ))}
    </ListGroup>
  );
}

export default withBlockPreview(PollGridBlockPreview);
