import React from 'react';
import { Badge, Button, Col, Row, Table } from 'reactstrap';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon } from '@triniti/cms/components/index.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function PollBlockPreview(props) {
  const { block, node } = props;
  const status = node.get('status').getValue();
  const url = nodeUrl(node, 'view');

  return (
    <Row className="gx-2">
      <Col>
        <Table borderless size="sm">
          <tbody>
          <tr>
            <th className="nowrap ps-2 pt-0" scope="row">Title:</th>
            <td className="w-100 text-break pt-0">{block.get('title', node.get('title'))}</td>
          </tr>
          <tr>
            <th colSpan={2} className="nowrap ps-2" scope="row">
              <Badge color="dark" className={`align-self-end status-${status}`}>{status}</Badge>
              <a href={url} className="ms-1" target="_blank">
                <Button color="hover" tag="span" size="sm" className="mb-0 me-0 p-0" style={{ minHeight: 'initial' }}>
                  <Icon imgSrc="external" alt="view" />
                </Button>
              </a>
            </th>
          </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

export default withBlockPreview(PollBlockPreview);
