import React from 'react';
import { Badge, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import camelCase from 'lodash-es/camelCase.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import startCase from 'lodash-es/startCase.js';
import withPbj from '@triniti/cms/components/with-pbj/index.js';

function TranscodeableCard({ asset, pbj }) {
  const status = asset.has('transcoding_status') ? asset.get('transcoding_status').getValue() : 'unknown';
  const videoId = AssetId.fromString(NodeRef.fromNode(asset).getId());
  const imageId = AssetId.fromString(`image_jpg_${videoId.getDate()}_${videoId.getUuid()}`);

  const image = pbj !== null ? pbj.set('_id', imageId) : null;
  const linkToImageAsset = image && nodeUrl(image, 'view');

  return (
    <Card>
      <CardHeader>
        Transcoding
        <span>
          Status <Badge color="dark" pill className={`status-${status}`}>{status}</Badge>
        </span>
      </CardHeader>
      <CardBody className="pb-3">
        {status === 'completed' && (
          <Table className="border-bottom border-light mb-0">
            <tbody>
              {['original', 'manifest', 'subtitled', 'video', 'tooltip-thumbnail-sprite', 'tooltip-thumbnail-track'].map((type) => (
                <tr key={type}>
                  <td className="pl-1">{`${startCase(camelCase(type))}:`}</td>
                  <td>
                    <a
                      href={artifactUrl(asset, type)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {` ${artifactUrl(asset, type)}`}
                    </a>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="pl-1">Image:</td>
                <td>
                  <a
                    href={damUrl(imageId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${damUrl(imageId)}`}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="pl-1">Image Asset:</td>
                <td>
                  {image && (
                    <Link to={linkToImageAsset} target="_blank" rel="noopener noreferrer">
                      {`${linkToImageAsset}`}
                    </Link>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        {status !== 'completed' && (
          <p>{`No artifacts available. Transcoding status: ${status}.`}</p>
        )}
      </CardBody>
    </Card>
  )
}

export default withPbj(TranscodeableCard, '*:dam:node:image-asset:v1');
