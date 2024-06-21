import React, { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchPicklistsSort from '@triniti/schemas/triniti/sys/enums/SearchPicklistsSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

const CreatePicklistModal = lazy(() => import('@triniti/cms/plugins/sys/components/create-picklist-modal/index.js'));

function SearchPicklistsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:picklist:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:picklist:update`);
  const navigate = useNavigate();

  return (
    <Screen
      title="Picklists"
      header="Picklists"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Picklist" modal={CreatePicklistModal} />}
        </>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table responsive className='table-hover'>
            <tbody>
            {response.get('nodes').map(node => (
              <tr key={`${node.get('_id')}`} role='button'>
                <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.get('title')} <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
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
            ))}
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
    count: 50,
    sort: SearchPicklistsSort.TITLE_ASC.getValue(),
  }
});
