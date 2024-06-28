import React from 'react';
import { Badge, Card, CardBody, CardHeader, Table } from 'reactstrap';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

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
        <Badge color="dark" pill className={`status-${status}`}>{status.getValue()}</Badge>
      </CardHeader>
      <CardBody>
        {status !== TranscodingStatus.COMPLETED && (
          <Table className="border-bottom border-light mb-0">
            <tbody>
            {artifactTypes.map((type) => (
              <tr key={type}>
                <td className="pl-1">{type}</td>
                <td>
                  <a href={artifactUrl(node, type)} target="_blank" rel="noopener noreferrer">
                    {artifactUrl(node, type)}
                  </a>
                </td>
              </tr>
            ))}
            <tr>
              <td className="pl-1">Image:</td>
              <td>
                <a href={damUrl(imageId)} target="_blank" rel="noopener noreferrer">
                  {damUrl(imageId)}
                </a>
              </td>
            </tr>
            <tr>
              <td className="pl-1">Image Asset:</td>
              <td>
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  {imageUrl}
                </a>
              </td>
            </tr>
            </tbody>
          </Table>
        )}
        {status !== TranscodingStatus.COMPLETED && (
          <p>{`No artifacts available. Transcoding status: ${status}.`}</p>
        )}
      </CardBody>
    </Card>
  )
}
