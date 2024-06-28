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

function TranscribeableCard({ node: asset, pbj }) {
    const status = asset.has('transcription_status') ? asset.get('transcription_status').getValue() : 'unknown';
    const videoId = AssetId.fromString(NodeRef.fromNode(asset).getId());
    const documentId = AssetId.fromString(`document_vtt_${videoId.getDate()}_${videoId.getUuid()}`);

    const document = pbj !== null ? pbj.set('_id', documentId) : null;
    const linkToDocumentAsset = document && nodeUrl(document, 'view');

    return (
        <Card>
            <CardHeader>
                Transcription
                <span>
                    Status <Badge color="dark" pill className={`status-${status}`}>{status}</Badge>
                </span>
            </CardHeader>
            <CardBody className="pb-3">
                {status === 'completed' && (
                    <Table className="border-bottom border-light mb-0">
                        <tbody>
                            {['audio', 'transcription'].map((type) => (
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
                                <td className="pl-1">Caption:</td>
                                <td>
                                    <a
                                        href={damUrl(documentId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {`${damUrl(documentId)}`}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="pl-1">Caption Asset:</td>
                                <td>
                                    {document && (
                                        <Link to={linkToDocumentAsset} target="_blank" rel="noopener noreferrer">
                                            {`${linkToDocumentAsset}`}
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                )}
                {status !== 'completed' && (
                    <p>{`No artifacts available. Transcription status: ${status}.`}</p>
                )}
            </CardBody>
        </Card>
    )
}

export default withPbj(TranscribeableCard, '*:dam:node:document-asset:v1');
