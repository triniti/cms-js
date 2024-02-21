import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import usePolicy from 'plugins/iam/components/usePolicy';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { getInstance } from '@triniti/demo/src/main';
import { Link } from 'react-router-dom';
import nodeUrl from 'plugins/ncr/nodeUrl';
import { Icon } from 'components';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});


const LivestreamsCard = ({ nodes }) => nodes.map(node => {
    const status = node.get('status')
      .toString();
    const kalturaEntryId = node.get('kaltura_entry_id');
    const channelArn = node.get('medialive_channel_arn');
   // const mediaLiveData = getInstance().getRedux().getState().ovp.mediaLive[`${NodeRef.fro}`];

    const title = node.isInMap('tags', 'livestream_label')
      ? `${node.getFromMap('tags', 'livestream_label')} | ${node.get('title')}`
      : node.get('title');
    return (
      <Card>
        <CardHeader> <span >
          <small className={`text-uppercase status-copy ml-0 mr-2 status-${statusColorMap[status]}`}>{status}</small>{title}
        </span>
          <span>
          <Link to={nodeUrl(node, 'view')}>
            <Button color="hover">
              <Icon imgSrc="eye" alt="view" />
            </Button>
          </Link>
            <Link to={nodeUrl(node, 'edit')}>
              <Button color="hover">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </Link>
          <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
            <Button color="hover">
              <Icon imgSrc="external" alt="open" />
            </Button>
          </a>
            </span>
        </CardHeader>
        <CardBody className="d-flex flex-row">
        </CardBody>
      </Card>
    );
  });

export default LivestreamsCard;
