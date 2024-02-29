import React, { lazy } from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';
import LivestreamsCard from './LivestreamsCard';

function LivestreamsScreen(props) {
  const { request } = props;
  const { response, pbjxError, run } = useRequest(request, true);
  const nodes = response ? response.get('nodes', []) : [];
  const metas = response ? response.get('metas', {}) : {};

  const reloadMedia = () => {
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
        <LivestreamsCard nodes={nodes} metas={metas} reloadMedia={reloadMedia}/>
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
