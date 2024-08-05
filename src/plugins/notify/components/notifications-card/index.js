import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader, CardText, Spinner, Table } from 'reactstrap';
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

const editable = { draft: true, scheduled: true };

function NotificationsCard(props) {
  const { contentRef, request } = props;
  request.set('content_ref', NodeRef.fromString(`${contentRef}`));
  const { response, pbjxError, run, isRunning } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:notification:create`);

  return (
    <>
      <Card>
        <CardHeader>
          <span>Notifications {isRunning && <Spinner />}</span>
          <span>
            {canCreate && (
              <CreateModalButton
                text="Create Notification"
                icon="plus-outline"
                size="sm"
                modal={CreateNotificationModal}
                modalProps={{ contentRef: contentRef }}
              />
            )}
            <Button color="light" size="sm" onClick={run} disabled={isRunning}>
              <Icon imgSrc="refresh" />
            </Button>
          </span>
        </CardHeader>
        <CardBody>
          {(!response || pbjxError) && <Loading error={pbjxError} />}

          {response && !response.has('nodes') && (
            <CardText>
              No notifications found for this {request.get('content_ref').getLabel()}.
            </CardText>
          )}

          {response && response.has('nodes') && (
            <Table hover responsive>
              <thead>
              <tr>
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
                return (
                  <tr key={`${node.get('_id')}`} className={`status-${sendStatus}`}>
                    <td className="text-nowrap">
                      {type}
                      {type === 'apple-news' && ` (${node.get('apple_news_operation')})`}
                    </td>
                    <td className="text-nowrap">{sendStatus}</td>
                    <td className="td-date">{formatDate(node.get('created_at'))}</td>
                    <td className="td-date">{formatDate(node.get('send_at'))}</td>
                    <td className="td-icons">
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
    count: 100,
    track_total_hits: false,
  }
});
