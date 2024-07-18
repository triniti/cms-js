import React from 'react';
import { Badge, Button, Col, Media, Row, Table } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon } from '@triniti/cms/components/index.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ImageBlockPreview(props) {
  const { block, imageAsset } = props;
  const ratio = `${block.get('aspect_ratio', '1by1')}`;
  const version = ratio === 'auto' ? '1by1' : ratio;
  const imageUrl = damUrl(imageAsset.get('_id'), version, 'sm');
  const status = imageAsset.get('status').getValue();

  return (
    <Row className="gx-2" >
      <Col xs={2}>
        <a href={nodeUrl(imageAsset, 'view')} className="hover-box-shadow d-inline-block rounded-2" target="_blank">
          <Media
              className={`block-image rounded-2 ratio-${version.replace('by', 'x')}`}
              src={imageUrl}
              alt=""
              width="100%"
              height="auto"
              object
          />
        </a>
      </Col>
      <Col>
        <Table borderless size="sm">
          <tbody>
          <tr>
            <th className="nowrap ps-2 pt-0" scope="row">Title:</th>
            <td className="w-100 text-break pt-0">{block.get('title') || imageAsset.get('display_title') || imageAsset.get('title', '')}</td>
          </tr>
          {block.has('caption') && (
            <tr>
              <th className="nowrap ps-2" scope="row">Caption:</th>
              <td className="w-100 text-break">{block.get('caption')}</td>
            </tr>
          )}
          {block.has('launch_text') && (
            <tr>
              <th className="nowrap ps-2" scope="row">Launch Text:</th>
              <td className="w-100 text-break">{block.get('launch_text')}</td>
            </tr>
          )}
          <tr>
            <th colSpan={2} className="nowrap ps-2" scope="row">
              <Badge color="dark" className={`align-self-end status-${status}`}>{status}</Badge>
              <a href={nodeUrl(imageAsset, 'view')} target="_blank">
                <Button color="hover" tag="span" size="sm" className="ms-3 mb-0 me-0 p-0" style={{ minHeight: 'initial' }}>
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

export default withBlockPreview(ImageBlockPreview);
