import React from 'react';
import { Alert, Badge, Card, CardBody, CardHeader, Table } from 'reactstrap';
import startCase from 'lodash-es/startCase.js';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';

const artifactTypes = ['original', 'manifest', 'subtitled', 'video', 'tooltip-thumbnail-sprite', 'tooltip-thumbnail-track'];

export default function TranscodeableCard(props) {
  const { node } = props;
  const status = node.get('transcoding_status', TranscodingStatus.UNKNOWN);
  const videoId = node.get('_id');
  const imageId = AssetId.fromString(`image_jpg_${videoId.getDate()}_${videoId.getUuid()}`);
  const imageUrl = expand('node.view', { label: 'image-asset', _id: imageId.toString() });

  return (
    <Card>
      <CardHeader>
        Transcoding
        <span>
          Status <Badge color="dark" pill className={`status-${status}`}>{status.getValue()}</Badge>
        </span>
      </CardHeader>
      {status === TranscodingStatus.COMPLETED && (
        <Table className="border-bottom border-light mb-0">
          <tbody>
          {artifactTypes.map((type) => (
            <tr key={type}>
              <th>{startCase(type.replace('tooltip-', ''))}</th>
              <td>
                <a href={artifactUrl(node, type)} target="_blank" rel="noopener noreferrer">
                  {artifactUrl(node, type)}
                </a>
              </td>
            </tr>
          ))}
          <tr>
            <th>Image Asset</th>
            <td><a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageId.toString()}</a></td>
          </tr>
          </tbody>
        </Table>
      )}
      {status !== TranscodingStatus.COMPLETED && (
        <CardBody>
          <Alert color="danger">No artifacts will be available until transcoding is completed.</Alert>
        </CardBody>
      )}
    </Card>
  );
}
