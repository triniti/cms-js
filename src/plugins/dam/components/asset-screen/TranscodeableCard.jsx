import React from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import artifactUrl from 'plugins/ovp/artifactUrl';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import camelCase from 'lodash/camelCase';
import damUrl from 'plugins/dam/damUrl';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import startCase from 'lodash/startCase';


export default function TranscodeableCard({ asset }) {
  const status = asset.has('transcoding_status') ? asset.get('transcoding_status').getValue() : 'unknown';
  const videoId = AssetId.fromString(NodeRef.fromNode(asset).getId());
  const imageId = AssetId.fromString(`image_jpg_${videoId.getDate()}_${videoId.getUuid()}`);
  const schema = asset.schema();


  return (
    <Card>
      <CardHeader>
        <span>
          Status <Badge color="dark" pill className={`status-${status}`}>{status}</Badge>
        </span>
      </CardHeader>

      <Table className="border-bottom border-light mb-0">
        <tbody>
          {['original', 'manifest', 'subtitled', 'video', 'tooltip-thumbnail-sprite', 'tooltip-thumbnail-track'].map((type) => (
            <tr>
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
        </tbody>
      </Table>


    </Card>

  )
}
