import { Card, CardBody, CardHeader, RouterLink, Table } from '@triniti/admin-ui-plugin/components';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import camelCase from 'lodash/camelCase';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';

import './styles.scss';

const TranscodeableCard = ({ node }) => {
  const status = node.has('transcoding_status') ? node.get('transcoding_status').getValue() : 'unknown';
  const videoId = AssetId.fromString(NodeRef.fromNode(node).getId());
  const imageId = AssetId.fromString(`image_jpg_${videoId.getDate()}_${videoId.getUuid()}`);
  const image = ImageAssetV1Mixin.findOne().createMessage().set('_id', imageId);

  return (
    <Card key={node.get('_id')} className="transcodeable-card">
      <CardHeader className="pr-2">
        Transcoding
        <div>
          <small className="text-uppercase status-copy mr-0 pr-0">
            status:
          </small>
          <small className={`text-uppercase status-copy mr-2 transcoding-status-${status}`}>
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
                {['original', 'manifest', 'subtitled', 'video', 'tooltip-thumbnail-sprite', 'tooltip-thumbnail-track'].map((type) => (
                  <tr>
                    <td className="pl-1">{`${startCase(camelCase(type))}:`}</td>
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
                  <td className="pl-1">Image:</td>
                  <td>
                    <a
                      href={damUrl(imageId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {` ${damUrl(imageId)}`}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="pl-1">Image Asset:</td>
                  <td>
                    <RouterLink to={pbjUrl(image, 'cms')}>{` ${pbjUrl(image, 'cms')}`}</RouterLink>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
      </CardBody>
    </Card>
  );
};

TranscodeableCard.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default TranscodeableCard;
