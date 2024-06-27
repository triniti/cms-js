import React from 'react';
import { Col, Media, Row, Card, CardBody, CardHeader, Table } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import CommonFields from '@triniti/cms/plugins/dam/components/asset-screen/CommonFields.js';

export default function ImageAssetFields(props) {
  const { node } = props;
  const id = node.get('_id');
  const originalUrl = damUrl(id);
  const previewUrl = damUrl(id, '1by1', 'md');

  return (
    <>
      <Card>
        <CardHeader>Image Asset</CardHeader>
        <CardBody>
          <Row>
            <Col sm={4} xl={4}>
              <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                <Media src={previewUrl} alt="" width="100%" height="auto" object className="rounded-2" />
              </a>
            </Col>
            <Col sm={8} xl={8}>
              <Table className="border-bottom">
                <tbody>
                <tr>
                  <th className="nowrap" scope="row">Asset ID:</th>
                  <td className="w-100">{`${id}`}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">MIME Type:</th>
                  <td className="w-100">{node.get('mime_type')}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">File Etag:</th>
                  <td className="w-100">{node.get('file_etag')}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">File Size:</th>
                  <td className="w-100">{formatBytes(node.get('file_size'))}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">Dimensions:</th>
                  <td className="w-100">{node.get('width')}x{node.get('height')}</td>
                </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <CommonFields {...props} />
      <TaggableFields />
    </>
  );
}
