import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchChannelsSort from '@triniti/schemas/triniti/taxonomy/enums/SearchChannelsSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';

const CreateChannelModal = lazy(() => import('@triniti/cms/plugins/taxonomy/components/create-channel-modal/index.js'));

function SearchChannelsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:channel:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:channel:update`);

  return (
    <Screen
      header="Channels"
      activeNav="Taxonomy"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Channel" icon="plus-outline" modal={CreateChannelModal} />}
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
                <td>{node.get('title')}</td>
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

export default withRequest(SearchChannelsScreen, 'triniti:taxonomy:request:search-channels-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchChannelsSort.TITLE_ASC.getValue(),
  }
});
