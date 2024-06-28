import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/notify/components/search-notifications-screen/SearchForm.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

const CreateNotificationModal = lazy(() => import('@triniti/cms/plugins/notify/components/create-notification-modal/index.js'));

function SearchNotificationsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:notify:create`);

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      header="Notifications"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create Notification" modal={CreateNotificationModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> people
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Creation Date</th>
                  <th>Send At</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {response.get('nodes', []).map(node => {
                  const schema = node.schema();
                  const canUpdate = policy.isGranted(`${schema.getQName()}:update`);
                  return (
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('send_status')}`}>
                      <td>{node.get('title')} <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
                      <td>{schema.getCurie().getMessage()}</td>
                      <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                      <td className="text-nowrap">{formatDate(node.get('send_at'))}</td>
                      <td className="text-nowrap">{node.get('send_status').toString()}</td>
                      <td className="td-icons">
                        <Link to={nodeUrl(node, 'view')}>
                          <Button id={`view-${node.get('_id')}`} color="hover" tag="span">
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
  }
});
