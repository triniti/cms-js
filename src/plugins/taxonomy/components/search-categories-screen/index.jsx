import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchCategoriesSort from '@triniti/schemas/triniti/taxonomy/enums/SearchCategoriesSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import usePolicy from 'plugins/iam/components/usePolicy';
import SearchForm from 'plugins/taxonomy/components/search-categories-screen/SearchForm';
import Collaborators from 'plugins/raven/components/collaborators';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

const CreateCategoryModal = lazy(() => import('plugins/taxonomy/components/create-category-modal'));

function SearchCategoriesScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:category:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:category:update`);

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Categories"
      header="Categories"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create Category" modal={CreateCategoryModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> categories
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {response.get('nodes', []).map(node => {
                  return (
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                      <td>{node.get('title')} <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
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

export default withRequest(withForm(SearchCategoriesScreen), 'triniti:taxonomy:request:search-categories-request', {
  persist: true,
  initialData: {
    sort: SearchCategoriesSort.TITLE_DESC.getValue(),
  }
});
