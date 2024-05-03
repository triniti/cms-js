import React, { lazy } from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import LivestreamsCard from './LivestreamsCard';

function LivestreamsScreen(props) {
  const { request } = props;
  const { response, pbjxError, run } = useRequest(request, true);
  const nodes = response ? response.get('nodes', []) : [];
  const metas = response ? response.get('metas', {}) : {};

  const reloadChannelState = () => {
    run();
  }

  return (
    <Screen
      title="Livestreams"
      header="Livestreams"
      contentWidth="1200px"
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && (
        <LivestreamsCard nodes={nodes} metas={metas} reloadChannelState={reloadChannelState}/>
      )}
    </Screen>
  );
}

export default withRequest(LivestreamsScreen, 'triniti:ovp:request:search-videos-request', {
  initialData: {
    derefs: ['medialive_channel_state'],
    q: '_exists_:medialive_channel_arn',
    sort: SearchVideosSort.ORDER_DATE_DESC.getValue(),
  }
});
