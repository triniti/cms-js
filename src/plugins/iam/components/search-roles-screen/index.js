import React, { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchRolesSort from '@gdbots/schemas/gdbots/iam/enums/SearchRolesSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';

const CreateRoleModal = lazy(() => import('@triniti/cms/plugins/iam/components/create-role-modal/index.js'));

function SearchRolesScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:role:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:role:update`);
  const navigate = useNavigate();

  return (
    <Screen
      title="Roles"
      header="Roles"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Role" icon="plus-outline" modal={CreateRoleModal} />}
        </>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table hover responsive>
            <tbody>
            {response.get('nodes').map(node => (
              <tr key={`${node.get('_id')}`} role='button'>
                <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.get('title')}</td>
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
            ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Screen>
  );
}

export default withRequest(SearchRolesScreen, 'gdbots:iam:request:search-roles-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchRolesSort.TITLE_ASC.getValue(),
  }
});
