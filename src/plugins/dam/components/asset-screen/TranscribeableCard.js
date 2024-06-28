import React from 'react';
import { Alert, Badge, Card, CardBody, CardHeader, Table } from 'reactstrap';
import startCase from 'lodash-es/startCase.js';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import TranscriptionStatus from '@triniti/schemas/triniti/ovp/enums/TranscriptionStatus.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';

const artifactTypes = ['audio', 'transcription'];

export default function TranscribeableCard(props) {
  const { node } = props;
  const status = node.get('transcription_status', TranscriptionStatus.UNKNOWN);
  const videoId = node.get('_id');
  const documentId = AssetId.fromString(`document_vtt_${videoId.getDate()}_${videoId.getUuid()}`);
  const documentUrl = expand('node.view', { label: 'document-asset', _id: documentId.toString() });

  return (
    <Card>
      <CardHeader>
        Transcription
        <span>
          Status <Badge color="dark" pill className={`status-${status}`}>{status.getValue()}</Badge>
        </span>
      </CardHeader>
      {status === TranscriptionStatus.COMPLETED && (
        <Table className="border-bottom border-light mb-0">
          <tbody>
          {artifactTypes.map((type) => (
            <tr key={type}>
              <th>{startCase(type)}</th>
              <td>
                <a href={artifactUrl(node, type)} target="_blank" rel="noopener noreferrer">
                  {artifactUrl(node, type)}
                </a>
              </td>
            </tr>
          ))}
          <tr>
            <th>Caption Asset</th>
            <td><a href={documentUrl} target="_blank" rel="noopener noreferrer">{documentId.toString()}</a></td>
          </tr>
          </tbody>
        </Table>
      )}
      {status !== TranscriptionStatus.COMPLETED && (
        <CardBody>
          <Alert color="danger">No artifacts will be available until transcribing is completed.</Alert>
        </CardBody>
      )}
    </Card>
  );
}
