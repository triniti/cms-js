import React, { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchSponsorsSort from '@triniti/schemas/triniti/boost/enums/SearchSponsorsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/boost/components/search-sponsors-screen/SearchForm.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import BatchOperationsCard from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';
import useBatchSelection from '@triniti/cms/plugins/ncr/components/useBatchSelection.js';

const CreateSponsorModal = lazy(() => import('@triniti/cms/plugins/boost/components/create-sponsor-modal/index.js'));

function SearchSponsorsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:sponsor:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:sponsor:update`);
  const canDelete = policy.isGranted(`${APP_VENDOR}:sponsor:delete`);
  const nodes = response ? response.get('nodes', []) : [];
  const { allSelected, toggle, toggleAll, selected, setSelected, setAllSelected } = useBatchSelection(nodes);
  const navigate = useNavigate();

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Sponsors"
      header="Sponsors"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create Sponsor" modal={CreateSponsorModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />

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
            Found <strong>{response.get('total').toLocaleString()}</strong> sponsors
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table responsive>
              <thead>
                <tr>
                  <th><Input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                  <th>Title</th>
                  <th>Created At</th>
                  <th>Published At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {response.get('nodes', []).map(node => {
                  return (
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`} role='button'>
                      <td><Input type="checkbox" onChange={() => toggle(`${node.get('_id')}`)} checked={selected.includes(`${node.get('_id')}`)} /></td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.get('title')} <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))} className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))} className="text-nowrap">{formatDate(node.get('published_at'))}</td>
                      <td className="td-icons">
                        <Link to={nodeUrl(node, 'view')}>
                          <Button tag="span" color="hover" className="rounded-circle">
                            <Icon imgSrc="eye" alt="view" />
                          </Button>
                        </Link>
                        {canUpdate && (
                          <Link to={nodeUrl(node, 'edit')}>
                            <Button tag="span" color="hover" className="rounded-circle">
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

export default withRequest(withForm(SearchSponsorsScreen), 'triniti:boost:request:search-sponsors-request', {
  persist: true,
  initialData: {
    sort: SearchSponsorsSort.RELEVANCE.getValue(),
  }
});
