import React, { lazy } from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';
import LivestreamsCard from './LivestreamsCard';

function LivestreamsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:video:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:video:update`);
  const canDelete = policy.isGranted(`${APP_VENDOR}:video:delete`);
  const nodes = response ? response.get('nodes', []) : [];


  return (
    <Screen
      title="Livestremas"
      header="Livestreams"
      contentWidth="800px"
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && (
        <LivestreamsCard nodes={nodes} />
      )}
    </Screen>
  );
}

export default withRequest(LivestreamsScreen, 'triniti:ovp:request:search-videos-request', {
  initialData: {
    q: '_exists_:medialive_channel_arn',
    sort: SearchVideosSort.ORDER_DATE_DESC.getValue(),
  }
});
