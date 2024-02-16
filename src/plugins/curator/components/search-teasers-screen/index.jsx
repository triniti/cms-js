import React, { lazy } from 'react';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useCuries from 'plugins/pbjx/components/useCuries';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import usePolicy from 'plugins/iam/components/usePolicy';
import SearchForm from 'plugins/curator/components/search-teasers-screen/SearchForm';
import Collaborators from 'plugins/raven/components/collaborators';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import BatchOperationsCard from 'plugins/ncr/components/batch-operations-card';
import useBatchSelection from 'plugins/ncr/components/useBatchSelection';

const CreateTeaserModal = lazy(() => import('plugins/curator/components/create-teaser-modal'));

function SearchTeasersScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:teaser:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:teaser:update`);
  const canDelete = policy.isGranted(`${APP_VENDOR}:teaser:delete`);
  const nodes = response ? response.get('nodes', []) : [];
  const { allSelected, toggle, toggleAll, selected, setSelected, setAllSelected } = useBatchSelection(nodes);

  const teaserCuries = useCuries('triniti:curator:mixin:teaser:v1');
  if (!teaserCuries) {
    return null;
  }

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Teasers"
      header="Teasers"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && (
            <CreateModalButton text="Create Teaser" modal={CreateTeaserModal} />
          )}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} teaserCuries={teaserCuries} />

      <BatchOperationsCard
        run={run}
        selected={selected}
        setSelected={setSelected}
        setAllSelected={setAllSelected}
        nodes={nodes}
        canDelete={canDelete}
        canDraft={canUpdate}
        canPublish={canUpdate}
      />

      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> teasers
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>
          <Card>
            <Table responsive>
              <thead>
                <tr>
                  <th><Input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                  <th>Title</th>
                  <th>Slotting</th>
                  <th>Created At</th>
                  <th>Published At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {response.get('nodes', []).map(node => {
                  const schema = node.schema();
                  const canUpdate = policy.isGranted(`${schema.getQName()}:update`);
                  return (
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                      <td><Input type="checkbox" onChange={() => toggle(`${node.get('_id')}`)} checked={selected.includes(`${node.get('_id')}`)} /></td>
                      <td>
                        {node.get('title')}
                        <Collaborators nodeRef={NodeRef.fromNode(node)} />
                        <Badge className="ms-1" color="light" pill>
                          {schema.getCurie().getMessage().replace('-teaser', '')}
                        </Badge>
                      </td>
                      <td>{node.has('slotting')
                        ? Object.entries(node.get('slotting')).map(([key, slot]) => (
                          <span key={`${key}:${slot}`}>{key}:{slot} </span>
                        ))
                        : null}</td>
                      <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                      <td className="text-nowrap">{formatDate(node.get('published_at'))}</td>
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
                  );
                })}
              </tbody>
            </Table>
          </Card>

          <Pager
            disabled={isRunning}
            hasMore={response.get('has_more')}
            page={request.get('page')}
            perPage={request.get('count')}
            total={response.get('total')}
            onChangePage={delegate.handleChangePage}
          />
        </>
      )}
    </Screen>
  );
}

export default withRequest(withForm(SearchTeasersScreen), 'triniti:curator:request:search-teasers-request', {
  persist: true,
  initialData: {
    sort: SearchTeasersSort.RELEVANCE.getValue(),
  }
});
