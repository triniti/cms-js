import { Card, CardBody, CardHeader, RouterLink, Table } from '@triniti/admin-ui-plugin/components';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import DocumentAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/document-asset/DocumentAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';

import './styles.scss';

const TranscribeableCard = ({ node }) => {
  const status = node.has('transcription_status') ? node.get('transcription_status').getValue() : 'unknown';
  const videoId = AssetId.fromString(NodeRef.fromNode(node).getId());
  const documentId = AssetId.fromString(`document_vtt_${videoId.getDate()}_${videoId.getUuid()}`);
  const document = DocumentAssetV1Mixin.findOne().createMessage().set('_id', documentId);

  return (
    <Card key={node.get('_id')} className="transcribable-card">
      <CardHeader className="pr-2">
        Transcription
        <div>
          <small className="text-uppercase status-copy mr-0 pr-0">
            status:
          </small>
          <small className={`text-uppercase status-copy mr-2 transcription-status-${status}`}>
            {status}
          </small>
        </div>
      </CardHeader>
      <CardBody className="pb-3">
        {status !== 'completed'
          ? <p>{`No artifacts available. Transcoding status: ${status}.`}</p>
          : (
            <Table className="table-sm" borderless hover responsive>
              <tbody>
                {['audio', 'transcription'].map((type) => (
                  <tr>
                    <td className="pl-1">{`${startCase(type)}:`}</td>
                    <td>
                      <a
                        href={artifactUrl(node, type)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {` ${artifactUrl(node, type)}`}
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
                      {` ${damUrl(documentId)}`}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="pl-1">Caption Asset:</td>
                  <td>
                    <RouterLink to={pbjUrl(document, 'cms')}>{` ${pbjUrl(document, 'cms')}`}</RouterLink>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
      </CardBody>
    </Card>
  );
};

TranscribeableCard.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default TranscribeableCard;
