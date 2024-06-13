import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchChannelsSort from '@triniti/schemas/triniti/taxonomy/enums/SearchChannelsSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/taxonomy/components/search-channels-screen/SearchForm.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import withForm from '@triniti/cms/components/with-form/index.js';

const CreateChannelModal = lazy(() => import('@triniti/cms/plugins/taxonomy/components/create-channel-modal/index.js'));

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
