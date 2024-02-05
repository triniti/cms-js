import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchChannelsSort from '@triniti/schemas/triniti/taxonomy/enums/SearchChannelsSort';
import { CreateModalButton, Icon, Loading, Screen } from 'components';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import usePolicy from 'plugins/iam/components/usePolicy';
import SearchForm from 'plugins/taxonomy/components/search-channels-screen/SearchForm';
import Collaborators from 'plugins/raven/components/collaborators';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import withForm from '../../../../components/with-form';

const CreateChannelModal = lazy(() => import('plugins/taxonomy/components/create-channel-modal'));

function SearchChannelsScreen(props) {
  const { request } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:channel:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:channel:update`);

  return (
    <Screen
      title="Channels"
      header="Channels"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create Channel" modal={CreateChannelModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table hover responsive>
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
                  <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
                    <Button color="hover">
                      <Icon imgSrc="external" alt="open" />
                    </Button>
                  </a>
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

export default withRequest(withForm(SearchChannelsScreen), 'triniti:taxonomy:request:search-channels-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchChannelsSort.TITLE_ASC.getValue(),
  }
});
