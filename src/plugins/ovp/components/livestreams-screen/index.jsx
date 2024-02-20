import React, { lazy } from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';
import LivestreamsCard from './LivestreamsCard';

const CreateVideoModal = lazy(() => import('plugins/ovp/components/create-video-modal'));

function LivestreamsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:video:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:video:update`);
  const canDelete = policy.isGranted(`${APP_VENDOR}:video:delete`);
  const nodes = response ? response.get('nodes', []) : [];

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Livestremas"
      header="Livestreams"
      contentWidth="800px"
    >

      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <LivestreamsCard nodes={nodes} />
         </>
      )}
    </Screen>
  );
}

export default withRequest(withForm(LivestreamsScreen), 'triniti:ovp:request:search-videos-request', {
  persist: true,
  initialData: {
    sort: SearchVideosSort.ORDER_DATE_DESC.getValue(),
  }
});
