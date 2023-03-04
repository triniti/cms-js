import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchFlagsetsSort from '@triniti/schemas/triniti/sys/enums/SearchFlagsetsSort';
import { CreateModalButton, Icon, Loading, Screen } from 'components';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';
import Collaborators from 'plugins/raven/components/collaborators';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

const CreateFlagsetModal = lazy(() => import('plugins/sys/components/create-flagset-modal'));

function SearchFlagsetsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:flagset:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:flagset:update`);

  return (
    <Screen
      title="Flagsets"
      header="Flagsets"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Flagset" modal={CreateFlagsetModal} />}
        </>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table hover responsive>
            <tbody>
            {response.get('nodes').map(node => (
              <tr key={`${node.get('_id')}`}>
                <td>{node.get('title')}  <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
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

export default withRequest(SearchFlagsetsScreen, 'triniti:sys:request:search-flagsets-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchFlagsetsSort.TITLE_ASC.getValue(),
  }
});
