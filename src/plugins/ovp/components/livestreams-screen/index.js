import React from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import { Loading, Screen } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import MediaLiveCard from '@triniti/cms/plugins/ovp/components/livestreams-screen/MediaLiveCard.js';

function LivestreamsScreen(props) {
  const { request } = props;
  const { response, pbjxError, isRunning, run } = useRequest(request);

  return (
    <Screen header="Livestreams" activeNav="Content">
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && !response.has('nodes') && (
        <p className="p-5">No livestreams have been created.</p>
      )}

      {response && response.get('nodes', []).map(node => {
        const nodeRef = node.generateNodeRef();
        const key = nodeRef.toString();
        const medialive = Object.entries(response.get('metas', {}))
          .reduce((newObj, [name, value]) => {
            if (!name.startsWith(key)) {
              return newObj;
            }

            const newName = name.replace(`${key}.`, '');
            if (newName.startsWith('medialive_channel_state')) {
              newObj.channelState = value;
            } else if (newName.startsWith('medialive_input_')) {
              newObj.inputs.push(value);
            } else if (newName.startsWith('mediapackage_origin_endpoint_')) {
              newObj.originEndpoints.push(value);
            } else if (newName.startsWith('mediapackage_cdn_endpoint_')) {
              newObj.cdnEndpoints.push(value);
            } else {
              newObj[newName] = value;
            }

            return newObj;
          }, { channelState: 'unknown', inputs: [], originEndpoints: [], cdnEndpoints: [] });

        return (
          <MediaLiveCard
            key={key}
            node={node}
            nodeRef={nodeRef}
            medialive={medialive}
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
    sort: SearchVideosSort.TITLE_ASC.getValue(),
  }
});
