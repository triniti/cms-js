import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import {
  Button,
  Card,
  Icon,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
  RouterLink,
} from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const ListAllChannels = ({ channels }) => {
  const channelList = channels.map((channel) => (
    <ListGroupItem key={channel.get('_id')} className="list-group-item-roles align-items-center" action>
      <ListGroupItemText className="mb-0 align-self-center">
        {channel.get('title')}
      </ListGroupItemText>
      <span>
        <Collaborators className="float-left mr-3" nodeRef={channel.get('_id').toNodeRef()} />
        <RouterLink to={pbjUrl(channel, 'cms')} className="mr-2">
          <Button id={`view-${channel.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="eye" alt="view" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`view-${channel.get('_id')}`}>View</UncontrolledTooltip>
        </RouterLink>
        <RouterLink to={`${pbjUrl(channel, 'cms')}/edit`} className="mr-2">
          <Button id={`edit-${channel.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="pencil" alt="edit" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`edit-${channel.get('_id')}`}>Edit</UncontrolledTooltip>
        </RouterLink>
        <a
          href={pbjUrl(channel, 'canonical')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="hover" id={`open-in-new-tab-${channel.get('_id')}`} radius="circle" className="mr-1 mb-0">
            <Icon imgSrc="external" alt="open" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${channel.get('_id')}`}>Open in new tab</UncontrolledTooltip>
        </a>
      </span>
    </ListGroupItem>
  ));

  return (
    <Card>
      <ListGroup>
        {channelList}
      </ListGroup>
    </Card>
  );
};

ListAllChannels.propTypes = {
  channels: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

export default ListAllChannels;
