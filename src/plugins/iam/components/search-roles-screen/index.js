import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchRolesSort from '@gdbots/schemas/gdbots/iam/enums/SearchRolesSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateRoleModal = lazy(() => import('@triniti/cms/plugins/iam/components/create-role-modal/index.js'));

function SearchRolesScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:role:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:role:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Roles"
      activeNav="Admin"
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
            {response.get('nodes').map(node => {
              const handleRowClick = createRowClickHandler(navigate, node);
              return (
                <tr key={`${node.get('_id')}`} className="cursor-pointer" onClick={handleRowClick}>
                  <td className="td-title">{node.get('title')}</td>
                  <td className="text-nowrap px-1 py-1"><Collaborators nodeRef={node.generateNodeRef().toString()} /></td>
                  <td className="td-icons" data-ignore-row-click={true}>
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
      )}
    </Screen>
  );
}

export default withRequest(SearchRolesScreen, 'gdbots:iam:request:search-roles-request', {
  persist: true,
  initialData: {
    count: 100,
    sort: SearchRolesSort.TITLE_ASC.getValue(),
  }
});
