import React from 'react';
import { Badge, Col, Media, Row, Table } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function AudioBlockPreview(props) {
  const { block, node } = props;
  const imageUrl = damUrl(block.get('image_ref'), '1by1', 'sm');
  const status = node.get('status').getValue();
  const url = nodeUrl(node, 'view');

  return (
    <Row className="gx-2">
      {imageUrl && (
        <Col xs={2}>
          <a href={url} className="hover-box-shadow d-inline-block rounded-2" target="_blank">
            <Media src={imageUrl} className="rounded-2 ratio-1x1" alt="" width="100%" height="auto" object />
          </a>
        </Col>
      )}
      <Col>
        <Table borderless size="sm">
          <tbody>
          <tr>
            <th className="nowrap ps-2 pt-0" scope="row">Title:</th>
            <td className="w-100 text-break pt-0">
              <a href={url} target="_blank">
                {block.get('title') || node.get('display_title') || node.get('title')}
              </a>
            </td>
          </tr>
          {block.has('launch_text') && (
            <tr>
              <th className="nowrap ps-2" scope="row">Launch Text:</th>
              <td className="w-100 text-break">{block.get('launch_text')}</td>
            </tr>
          )}
          <tr>
            <th colSpan={2} className="nowrap ps-2 fs-5" scope="row">
              <Badge color="dark" className={`rounded-pill status-${status}`}>{status}</Badge>
            </th>
          </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

export default withBlockPreview(AudioBlockPreview);
