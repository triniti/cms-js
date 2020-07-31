import { Button, Card, Collapse, CardBody, CardHeader, RouterLink } from '@triniti/admin-ui-plugin/components';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import DocumentAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/document-asset/DocumentAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import startCase from 'lodash/startCase';

import './styles.scss';

const TranscribeableCard = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const status = node.has('transcription_status') ? node.get('transcription_status').getValue() : 'unknown';
  const videoId = AssetId.fromString(NodeRef.fromNode(node).getId());
  const documentId = AssetId.fromString(`document_vtt_${videoId.getDate()}_${videoId.getUuid()}`);
  const document = DocumentAssetV1Mixin.findOne().createMessage().set('_id', documentId);

  return (
    <Card key={node.get('_id')} className="transcribable-card">
      <CardHeader toggler className="pr-2">
        <Button color="toggler" onClick={() => setIsOpen(!isOpen)} active={isOpen}>Transcribing</Button>
        <div>
          <small className="text-uppercase status-copy mr-0 pr-0">
            status:
          </small>
          <small className={`text-uppercase status-copy mr-2 status-${status}`}>
            {status}
          </small>
        </div>
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <CardBody className="pb-3">
          {status !== 'completed'
            ? <p>{`No artifacts available. Transcribing status: ${status}.`}</p>
            : (
              <ul className="pl-4">
                {['audio', 'transcription'].map((type) => (
                  <li className="mb-1">{`${startCase(type)}:`}
                    <a
                      href={artifactUrl(node, type)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {` ${artifactUrl(node, type)}`}
                    </a>
                  </li>
                ))}
                <li className="mb-1">Caption:
                  <a
                    href={damUrl(documentId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {` ${damUrl(documentId)}`}
                  </a>
                </li>
                <li className="mb-1">Caption Asset:
                  <RouterLink to={pbjUrl(document, 'cms')}>{` ${pbjUrl(document, 'cms')}`}</RouterLink>
                </li>
              </ul>
            )}
        </CardBody>
      </Collapse>
    </Card>
  );
};

TranscribeableCard.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default TranscribeableCard;
