import React, { lazy } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});

const LivestreamsCard = ({
  nodes,
  run,
}) =>  nodes.map(node=> {
    const status = node.get('status')
      .toString();
    const kalturaEntryId = node.get('kaltura_entry_id');
    const channelArn = node.get('medialive_channel_arn');

    const title = node.isInMap('tags', 'livestream_label')
      ? `${node.getFromMap('tags', 'livestream_label')} | ${node.get('title')}`
      : node.get('title');
  return (
    <Card>
      <CardHeader> <small
        className={`text-uppercase status-copy ml-0 mr-2 status-${statusColorMap[status]}`}>
        {status}
      </small>
        <p className="mb-0 mr-2 medialive-channel-card__header-text">{title}</p>
      </CardHeader>
      <CardBody className="d-flex flex-row">
      </CardBody>
    </Card>
    );
});

export default LivestreamsCard;
