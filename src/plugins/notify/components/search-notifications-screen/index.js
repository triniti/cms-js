import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/notify/components/search-notifications-screen/SearchForm.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateNotificationModal = lazy(() => import('@triniti/cms/plugins/notify/components/create-notification-modal/index.js'));

const editable = { draft: true, scheduled: true };

function SearchNotificationsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:notification:create`);
  const navigate = useNavigate();

  const curies = useCuries('triniti:notify:mixin:notification:v1');
  if (!curies) {
    return null;
  }

  return (
    <Screen
      header="Notifications"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate &&
            <CreateModalButton text="Create Notification" icon="plus-outline" modal={CreateNotificationModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} curies={curies} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> notifications
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Send At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => {
                const schema = node.schema();
                const sendStatus = node.get('send_status').toString();
                const type = schema.getCurie().getMessage().replace('-notification', '');
                const canUpdate = editable[sendStatus] && policy.isGranted(`${schema.getQName()}:update`);
                const handleRowClick = createRowClickHandler(navigate, node);

                return (
                  <tr key={`${node.get('_id')}`} className={`status-${sendStatus} cursor-pointer`} onClick={handleRowClick}>
                    <td>{node.get('title')}</td>
                    <td className="text-nowrap">
                      {type}
                      {type === 'apple-news' && ` (${node.get('apple_news_operation')})`}
                    </td>
                    <td className="text-nowrap">{sendStatus}</td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('send_at'))}</td>
                    <td className="td-icons" data-ignore-row-click>
                      <Link to={nodeUrl(node, 'view')}>
                        <Button color="hover" tag="span">
                          <Icon imgSrc="eye" alt="view" />
                        </Button>
                      </Link>
                      {canUpdate && (
                        <Link to={nodeUrl(node, 'edit')}>
                          <Button color="hover" tag="span">
                            <Icon imgSrc="pencil" alt="edit" />
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
          </Card>

          <Pager
            disabled={isRunning}
            hasMore={response.get('has_more')}
            page={request.get('page')}
            perPage={request.get('count')}
            total={response.get('total')}
            onChangePage={delegate.handleChangePage}
          />
        </>
      )}
    </Screen>
  );
}

export default withRequest(withForm(SearchNotificationsScreen), 'triniti:notify:request:search-notifications-request', {
  persist: true,
  initialData: {
    sort: SearchNotificationsSort.CREATED_AT_DESC.getValue(),
    track_total_hits: true,
  }
});
