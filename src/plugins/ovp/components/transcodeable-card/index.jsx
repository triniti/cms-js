import { Button, Card, Collapse, CardBody, CardHeader, RouterLink } from '@triniti/admin-ui-plugin/components';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import camelCase from 'lodash/camelCase';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import startCase from 'lodash/startCase';

import './styles.scss';

const TranscodeableCard = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const status = node.has('transcoding_status') ? node.get('transcoding_status').getValue() : 'unknown';
  const videoId = AssetId.fromString(NodeRef.fromNode(node).getId());
  const imageId = AssetId.fromString(`image_jpg_${videoId.getDate()}_${videoId.getUuid()}`);
  const image = ImageAssetV1Mixin.findOne().createMessage().set('_id', imageId);

  return (
    <Card key={node.get('_id')} className="transcodeable-card">
      <CardHeader toggler className="pr-2">
        <Button color="toggler" onClick={() => setIsOpen(!isOpen)} active={isOpen}>Transcoding</Button>
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
            ? <p>{`No artifacts available. Transcoding status: ${status}.`}</p>
            : (
              <ul className="pl-4">
                {['original', 'manifest', 'video', 'tooltip-thumbnail-sprite', 'tooltip-thumbnail-track'].map((type) => (
                  <li className="mb-1">{`${startCase(camelCase(type))}:`}
                    <a
                      href={artifactUrl(node, type)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {` ${artifactUrl(node, type)}`}
                    </a>
                  </li>
                ))}
                <li className="mb-1">Image:
                  <a
                    href={damUrl(imageId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {` ${damUrl(imageId)}`}
                  </a>
                </li>
                <li className="mb-1">Image Asset:
                  <RouterLink to={pbjUrl(image, 'cms')}>{` ${pbjUrl(image, 'cms')}`}</RouterLink>
                </li>
              </ul>
            )}
        </CardBody>
      </Collapse>
    </Card>
  );
};

TranscodeableCard.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default TranscodeableCard;
