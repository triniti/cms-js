import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort';
import { CreateModalButton, Icon, Loading, Screen } from 'components';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';

const CreateAppModal = lazy(() => import('plugins/iam/components/create-app-modal'));

function SearchAppsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:app:create`);

  return (
    <Screen
      title="Apps"
      header="Apps"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create App" modal={CreateAppModal} />}
        </>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table responsive>
            <tbody>
            {response.get('nodes').map(node => {
              const schema = node.schema();
              const canUpdate = policy.isGranted(`${schema.getQName()}:update`);
              return (
                <tr key={`${node.get('_id')}`}>
                  <td>
                    {node.get('title')}
                    <Badge className="ms-1" color="light" pill>
                      {schema.getCurie().getMessage().replace('-app', '')}
                    </Badge>
                  </td>
                  <td className="td-icons">
                    <Link to={nodeUrl(node, 'view')}>
                      <Button color="hover">
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
      )}
    </Screen>
  );
}

export default withRequest(SearchAppsScreen, 'gdbots:iam:request:search-apps-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchAppsSort.TITLE_ASC.getValue(),
  }
});
