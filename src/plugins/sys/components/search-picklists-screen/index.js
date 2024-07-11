import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchPicklistsSort from '@triniti/schemas/triniti/sys/enums/SearchPicklistsSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreatePicklistModal = lazy(() => import('@triniti/cms/plugins/sys/components/create-picklist-modal/index.js'));

function SearchPicklistsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:picklist:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:picklist:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Picklists"
      activeNav="Admin"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Picklist" icon="plus-outline" modal={CreatePicklistModal} />}
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
                  <td>{node.get('title')}</td>
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
      )}
    </Screen>
  );
}

export default withRequest(SearchPicklistsScreen, 'triniti:sys:request:search-picklists-request', {
  persist: true,
  initialData: {
    count: 100,
    sort: SearchPicklistsSort.TITLE_ASC.getValue(),
  }
});
