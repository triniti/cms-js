import React from 'react';
import { Badge, Button, Card, CardHeader, Spinner, Table } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

const numberFormatter = new Intl.NumberFormat('en-US');
const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  //maximumSignificantDigits: 1,
});

export default function StatsCard(props) {
  const { nodeRef, poll } = props;
  const { node, refreshNode, isRefreshing } = useNode(nodeRef);
  if (!node) {
    return null;
  }

  const total = node.get('votes');
  const answers = poll.get('answers').reduce((acc, val) => {
    acc[`${val.get('_id')}`] = val;
    return acc;
  }, {});

  return (
    <Card className="border-top border-dark-subtle">
      <CardHeader>
        <span>Stats {isRefreshing && <Spinner />}</span>
        <Button color="light" size="sm" onClick={refreshNode} disabled={isRefreshing}>
          <Icon imgSrc="refresh" />
        </Button>
      </CardHeader>

      <Table className="border-bottom border-light mb-0">
        <tbody>
        <tr>
          <th className="nowrap pe-0" scope="row">Total Votes:</th>
          <td>{numberFormatter.format(total)}</td>
          <td>&nbsp;</td>
        </tr>
        {node.has('answer_votes') && Object.entries(node.get('answer_votes')).map(([key, value]) => {
          const percent = value / total;
          const answer = answers[key] ? answers[key].get('title') : key;
          return (
            <tr key={key}>
              <th className="nowrap pe-0" scope="row">{answer}:</th>
              <td>{numberFormatter.format(value)}</td>
              <td className="w-100">
                <Badge color="light">{percentFormatter.format(percent)}</Badge>
              </td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </Card>
  );
}
