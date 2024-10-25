import React from 'react';
import { Badge, Button, Col, Media, Row, Table } from 'reactstrap';
import { aspectRatios } from '@triniti/cms/plugins/dam/constants.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon } from '@triniti/cms/components/index.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function DocumentBlockPreview(props) {
  const { block, node } = props;
  const ratio = `${block.get('aspect_ratio', 'auto')}`;
  const version = ratio === 'auto' ? '1by1' : ratio;
  const imageUrl = damUrl(block.get('image_ref'), version, 'sm');
  const status = node.get('status').getValue();
  const url = nodeUrl(node, 'view');

  return (
    <Row className="gx-2">
      {imageUrl && (
        <Col xs={2}>
          <a href={url} className="hover-box-shadow d-inline-block rounded-2" target="_blank">
            <Media
              src={imageUrl}
              className={`rounded-2 ratio-${version.replace('by', 'x')}`}
              alt=""
              width="100%"
              height="auto"
              object
            />
          </a>
        </Col>
      )}
      <Col>
        <Table borderless size="sm">
          <tbody>
          <tr>
            <th className="nowrap ps-2 pt-0" scope="row">Title:</th>
            <td className="w-100 text-break pt-0">
              {block.get('title') || node.get('display_title') || node.get('title')}
            </td>
          </tr>
          <tr>
            <th className="nowrap ps-2" scope="row">Aspect Ratio:</th>
            <td className="w-100 text-break">{aspectRatios[ratio] || ratio.toUpperCase()}</td>
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
              <a href={url} className="ms-2" target="_blank">
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

export default withBlockPreview(DocumentBlockPreview);
