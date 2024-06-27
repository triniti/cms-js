import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import ReactPlayer from 'react-player';
import CommonFields from '@triniti/cms/plugins/dam/components/asset-screen/CommonFields.js';
import TranscodeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscodeableCard.js';
import TranscribeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscribeableCard.js';


export default function VideoAssetFields(props) {
  const { node } = props;
  const asset = node;
  const schema = node.schema();

  return (
    <>
      <Container fluid className="ui-cols">
        <Row>
          <Col xs="6 ps-0">
            <TextField name="mime_type" label="MIME type" readOnly />
            <TextField name="file_size" label="File size" format={formatBytes} readOnly />
          </Col>
          <Col xs="6 pe-0">
            <ReactPlayer.default url={artifactUrl(asset, 'video')} width="100%" height="auto" controls />
          </Col>
        </Row>
      </Container>
      <CommonFields asset={asset} credit="video-asset-credits" />

      {schema.hasMixin('triniti:ovp:mixin:transcodeable') && (
       <TranscodeableCard asset={node} />
      )}
      {schema.hasMixin('triniti:ovp:mixin:transcribable') && (
       <TranscribeableCard asset={node} />
      )}
    </>
  );
}
