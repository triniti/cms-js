import React from 'react';
import { Button, Card, CardHeader, Spinner, Table } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

const numberFormatter = new Intl.NumberFormat('en-US');

export default function ReactionsCard(props) {
  const { nodeRef } = props;
  const { node, refreshNode, isRefreshing } = useNode(nodeRef);
  if (!node) {
    return null;
  }

  return (
    <Card className="border-top">
      <CardHeader>
        <span>Reactions {isRefreshing && <Spinner />}</span>
        <Button color="light" size="sm" onClick={refreshNode} disabled={isRefreshing}>
          <Icon imgSrc="refresh" />
        </Button>
      </CardHeader>

      <Table className="border-bottom border-light mb-0">
        <tbody>
        {node.has('reactions') && Object.entries(node.get('reactions')).map(([key, value]) => {
          return (
            <tr key={key}>
              <th className="nowrap pe-0" scope="row">{key}:</th>
              <td>{numberFormatter.format(value)}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </Card>
  );
}
