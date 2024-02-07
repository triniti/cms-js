import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { CreateModalButton, Icon, Loading, } from 'components';
import { Link } from 'react-router-dom';
import usePolicy from 'plugins/iam/components/usePolicy';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import formatDate from '@triniti/cms/utils/formatDate';
import nodeUrl from 'plugins/ncr/nodeUrl';

const CreateNotificationModal = lazy(() => import('plugins/notify/components/create-notification-modal'));


function HasNotificationsCard(props) {
  const { editMode, node, contentRef, request } = props;
  request.set('content_ref', NodeRef.fromString(contentRef));

  const { response, pbjxError } = useRequest(request, true);

  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:notify:create`);

  return (
    <>
      <Card>
        <CardHeader>
          Notifications
          {canCreate && <CreateModalButton text="Create Notification" modal={CreateNotificationModal} modalProps={{contentRef: contentRef}} disabled={!editMode} />}
        </CardHeader>
        <CardBody>
          {(!response || pbjxError) && <Loading error={pbjxError} />}

          {response && (
            <>
              <Card>
                <Table responsive>
                  <thead>
                    <tr>
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
                          <td>
                            {schema.getCurie().getMessage()}
                            {node.has('apple_news_operation') ? ` (${node.get('apple_news_operation')})` : ''}
                          </td>
                          <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                          <td className="text-nowrap">{formatDate(node.get('send_at'))}</td>
                          <td className="text-nowrap">{node.get('send_status').toString()}</td>
                          <td className="td-icons">
                            <Link to={nodeUrl(node, 'view')}>
                              <Button id={`view-${node.get('_id')}`} color="hover">
                                <Icon imgSrc="eye" alt="view" />
                              </Button>
                            </Link>
                            {canUpdate && (
                              <Link to={nodeUrl(node, 'edit')}>
                                <Button color="hover">
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
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default withRequest(HasNotificationsCard, 'triniti:notify:request:search-notifications-request', {
  channel: 'article-notifications-tab',
  initialData: {
    sort: SearchNotificationsSort.CREATED_AT_DESC.getValue(),
  }
});
