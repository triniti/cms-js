import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchPicklistsSort from '@triniti/schemas/triniti/sys/enums/SearchPicklistsSort';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';
import Collaborators from 'plugins/raven/components/collaborators';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

const CreatePicklistModal = lazy(() => import('plugins/sys/components/create-picklist-modal'));

function SearchPicklistsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:picklist:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:picklist:update`);

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
          <Table responsive>
            <tbody>
            {response.get('nodes').map(node => (
              <tr key={`${node.get('_id')}`}>
                <td>{node.get('title')} <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
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
