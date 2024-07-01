import React from 'react';
import { Button, Card, CardHeader, Spinner, Table } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

const numberFormatter = new Intl.NumberFormat('en-US');

export default function StatsCard(props) {
  const { nodeRef } = props;
  const { node, refreshNode, isRefreshing } = useNode(nodeRef);
  if (!node) {
    return null;
  }

  return (
    <Card className="border-top">
      <CardHeader>
        <span>Stats {isRefreshing && <Spinner />}</span>
        <Button color="light" size="sm" onClick={refreshNode} disabled={isRefreshing}>
          <Icon imgSrc="refresh" />
        </Button>
      </CardHeader>

      <Table className="border-bottom border-light mb-0">
        <tbody>
        <tr>
          <th className="nowrap pe-0" scope="row">Page Views:</th>
          <td>{numberFormatter.format(node.get('views'))}</td>
        </tr>
        <tr>
          <th className="nowrap pe-0" scope="row">GA Unique Views:</th>
          <td>{numberFormatter.format(node.get('ga_unique_pageviews'))}</td>
        </tr>
        <tr>
          <th className="nowrap pe-0" scope="row">FB Engagement:</th>
          <td>{numberFormatter.format(node.get('fb_engagement'))}</td>
        </tr>
        </tbody>
      </Table>
    </Card>
  );
}
