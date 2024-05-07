import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';
import humanizeBytes from '@triniti/cms/utils/humanizeBytes.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import ReactPlayer from 'react-player';
import CommonFields from '@triniti/cms/plugins/dam/components/asset-screen/CommonFields.js';


export default function VideoAssetFields(props) {
  const { asset } = props

  return (
    <>
      <Container fluid className="ui-cols">
        <Row>
          <Col xs="6 ps-0">
            <TextField name="mime_type" label="MIME type" readOnly />
            <TextField name="file_size" label="File size" format={humanizeBytes} readOnly />
          </Col>
          <Col xs="6 pe-0">
            <ReactPlayer url={artifactUrl(asset, 'video')} width="100%" height="auto" controls />
          </Col>
        </Row>
      </Container>
      <CommonFields asset={asset} credit="video-asset-credits" />
    </>
  );
}
