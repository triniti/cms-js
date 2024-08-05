import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchCategoriesSort from '@triniti/schemas/triniti/taxonomy/enums/SearchCategoriesSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/taxonomy/components/search-categories-screen/SearchForm.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateCategoryModal = lazy(() => import('@triniti/cms/plugins/taxonomy/components/create-category-modal/index.js'));

function SearchCategoriesScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:category:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:category:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Categories"
      activeNav="Taxonomy"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Category" icon="plus-outline" modal={CreateCategoryModal} />}
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
            <Table hover responsive>
              <thead>
              <tr>
                <th>Title</th>
                <th></th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => {
                const handleRowClick = createRowClickHandler(navigate, node);
                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
                    <td>{node.get('title')}</td>
                    <td className="text-nowrap"><Collaborators nodeRef={node.generateNodeRef().toString()} /></td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('updated_at'))}</td>
                    <td className="td-icons" data-ignore-row-click>
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
    sort: SearchCategoriesSort.TITLE_ASC.getValue(),
    track_total_hits: true,
  }
});
