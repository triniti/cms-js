import React from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import { Button } from 'reactstrap';
import { Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import MediaLiveCard from '@triniti/cms/plugins/ovp/components/livestreams-screen/MediaLiveCard.js';

function LivestreamsScreen(props) {
  const { request } = props;
  const { response, pbjxError, isRunning, run } = useRequest(request);

  return (
    <Screen
      header="Livestreams"
      activeNav="Content"
      primaryActions={
        <a href="https://players.akamai.com/hls/" target="_blank" rel="noopener noreferrer">
          <Button color="hover" tag="span">
            <Icon imgSrc="external" alt="open" className="me-2" />
            HLS Player
          </Button>
        </a>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && !response.has('nodes') && (
        <p className="p-5">No livestreams have been created.</p>
      )}

      {response && response.get('nodes', []).map(node => {
        const nodeRef = node.generateNodeRef();
        const key = nodeRef.toString();

        return (
          <MediaLiveCard
            key={key}
            node={node}
            nodeRef={nodeRef}
            metas={response.get('metas', {})}
            refresh={run}
            isRefreshing={isRunning}
          />
        );
      })}
    </Screen>
  );
}

export default withRequest(LivestreamsScreen, 'triniti:ovp:request:search-videos-request', {
  channel: 'livestreams',
  initialData: {
    derefs: ['medialive_channel_state'],
    q: '+_exists_:medialive_channel_arn',
    sort: SearchVideosSort.UPDATED_AT_DESC.getValue(),
  }
});
