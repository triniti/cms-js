import React from 'react';
import { Card, CardBody } from 'reactstrap';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState.js';
import MediaLiveCardHeader from '@triniti/cms/plugins/ovp/components/livestreams-screen/mediaLiveCardHeader.js';
import MediaLiveChannelControls from '@triniti/cms/plugins/ovp/components/media-live-channel-controls/index.js';
import MediaLiveChannelDetails from '@triniti/cms/plugins/ovp/components/livestreams-screen/mediaLiveChannelDetails.js';

const defaultMedialive = {
  channelState: ChannelState.UNKNOWN.getValue(),
  inputs: [],
  originEndpoints: [],
  cdnEndpoints: [],
};

export default function MediaLiveCard(props) {
  const { node, nodeRef, medialive = defaultMedialive, refresh, isRefreshing = false } = props;

  return (
    <Card>
      <MediaLiveCardHeader node={node} isRefreshing={isRefreshing} />
      <CardBody className="p-2">
        <MediaLiveChannelControls
          nodeRef={nodeRef}
          medialive={medialive}
          refresh={refresh}
          isRefreshing={isRefreshing}
        />
        <MediaLiveChannelDetails node={node} medialive={medialive} />
      </CardBody>
    </Card>
  );
}
