import React, { lazy } from 'react';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchRedirectsSort from '@triniti/schemas/triniti/sys/enums/SearchRedirectsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/sys/components/search-redirects-screen/SearchForm.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import BatchOperationsCard from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';
import useBatchSelection from '@triniti/cms/plugins/ncr/components/useBatchSelection.js';

const CreateRedirectModal = lazy(() => import('@triniti/cms/plugins/sys/components/create-redirect-modal/index.js'));

function SearchRedirectsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:redirect:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:redirect:update`);
  const canDelete = policy.isGranted(`${APP_VENDOR}:redirect:delete`);
  const nodes = response ? response.get('nodes', []) : [];
  const { allSelected, toggle, toggleAll, selected, setSelected, setAllSelected } = useBatchSelection(nodes);

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Redirects"
      header="Redirects"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create Redirect" modal={CreateRedirectModal} />}
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
        canDraft={false}
        canPublish={false}
      />

      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> redirects
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table responsive>
              <thead>
              <tr>
                <th><Input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                <th>Request URI</th>
                <th>Redirect URI</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => (
                <tr key={`${node.get('_id')}`}>
                  <td><Input type="checkbox" onChange={() => toggle(`${node.get('_id')}`)} checked={selected.includes(`${node.get('_id')}`)} /></td>
                  <td>{node.get('title')} <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
                  <td>{node.get('redirect_to')}</td>
                  <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                  <td className="text-nowrap">{formatDate(node.get('updated_at'))}</td>
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

export default withRequest(withForm(SearchRedirectsScreen), 'triniti:sys:request:search-redirects-request', {
  persist: true,
  initialData: {
    sort: SearchRedirectsSort.TITLE_ASC.getValue(),
  }
});
