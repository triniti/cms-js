import React from 'react';
import { Col, Media, Row, Table } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ImageBlockPreview(props) {
  const { block, imageAsset } = props;
  const ratio = `${block.get('aspect_ratio', '1by1')}`;
  const version = ratio === 'auto' ? '1by1' : ratio;
  const imageUrl = damUrl(imageAsset.get('_id'), version, 'sm');

  return (
    <Row>
      <Col sm={4} xl={4}>
        <Media
          className={`block-image rounded-3 ratioxx xxratio-${version.replace('by', 'x')}`}
          src={imageUrl}
          alt=""
          width="100"
          height="auto"
          object
        />
      </Col>
      <Col sm={8} xl={8}>
        <Table className="border-bottom mt-2" size="sm">
          <tbody>
          <tr>
            <th className="nowrap ps-2" scope="row">Title:</th>
            <td className="w-100 text-break">{block.get('title', imageAsset.get('title'), '')}</td>
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
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

export default withBlockPreview(ImageBlockPreview);
