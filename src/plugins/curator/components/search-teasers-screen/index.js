import React, { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/curator/components/search-teasers-screen/SearchForm.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import BatchOperationsCard from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';
import useBatchSelection from '@triniti/cms/plugins/ncr/components/useBatchSelection.js';
import CloneButton from '@triniti/cms/plugins/ncr/components/clone-button/index.js';

const CreateTeaserModal = lazy(() => import('@triniti/cms/plugins/curator/components/create-teaser-modal/index.js'));

function SearchTeasersScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:teaser:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:teaser:update`);
  const canDelete = policy.isGranted(`${APP_VENDOR}:teaser:delete`);
  const nodes = response ? response.get('nodes', []) : [];
  const { allSelected, toggle, toggleAll, selected, setSelected, setAllSelected } = useBatchSelection(nodes);
  const navigate = useNavigate();

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
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`} role='button'>
                      <td><Input type="checkbox" onChange={() => toggle(`${node.get('_id')}`)} checked={selected.includes(`${node.get('_id')}`)} /></td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))}>
                        {node.get('title')}
                        <Collaborators nodeRef={NodeRef.fromNode(node)} />
                        <Badge className="ms-1" color="light" pill>
                          {schema.getCurie().getMessage().replace('-teaser', '')}
                        </Badge>
                      </td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.has('slotting')
                        ? Object.entries(node.get('slotting')).map(([key, slot]) => (
                          <span key={`${key}:${slot}`}>{key}:{slot} </span>
                        ))
                        : null}</td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))} className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))} className="text-nowrap">{formatDate(node.get('published_at'))}</td>
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
                        {canCreate && (
                          <CloneButton node={node} />
                        )}
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
