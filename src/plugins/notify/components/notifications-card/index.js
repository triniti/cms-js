import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { CreateModalButton, Icon, Loading, } from '@triniti/cms/components/index.js';
import { Link } from 'react-router-dom';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

const CreateNotificationModal = lazy(() => import('@triniti/cms/plugins/notify/components/create-notification-modal/index.js'));

function NotificationsCard(props) {
  const { contentRef, request } = props;
  request.set('content_ref', NodeRef.fromString(contentRef));
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:notify:create`);

  return (
    <>
      <Card>
        <CardHeader>
          Notifications
          {canCreate && (
            <CreateModalButton
              text="Create Notification"
              icon="plus-outline"
              modal={CreateNotificationModal}
              modalProps={{ contentRef: contentRef }}
            />
          )}
        </CardHeader>
        <CardBody>
          {(!response || pbjxError) && <Loading error={pbjxError} />}

          {response && (
            <Table hover responsive>
              <thead>
              <tr>
                <th>Type</th>
                <th>Created At</th>
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
                    <td>
                      {schema.getCurie().getMessage()}
                      {node.has('apple_news_operation') ? ` (${node.get('apple_news_operation')})` : ''}
                    </td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('send_at'))}</td>
                    <td className="text-nowrap">{node.get('send_status').toString()}</td>
                    <td className="td-icons">
                      <Link to={nodeUrl(node, 'view')}>
                        <Button color="hover" tabIndex="-1">
                          <Icon imgSrc="eye" alt="view" />
                        </Button>
                      </Link>
                      {canUpdate && (
                        <Link to={nodeUrl(node, 'edit')}>
                          <Button color="hover" tabIndex="-1">
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
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default withRequest(NotificationsCard, 'triniti:notify:request:search-notifications-request', {
  channel: 'tab',
  initialData: {
    sort: SearchNotificationsSort.CREATED_AT_DESC.getValue(),
    count: 50,
    track_total_hits: false,
  }
});
