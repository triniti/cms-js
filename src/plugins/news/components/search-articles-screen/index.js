import React, { lazy } from 'react';
import { Button, Card, Input, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/news/components/search-articles-screen/SearchForm.js';
import BatchOperationsCard from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateArticleModal = lazy(() => import('@triniti/cms/plugins/news/components/create-article-modal/index.js'));

function SearchArticlesScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:article:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:article:update`);
  const batch = useBatch(response);
  const navigate = useNavigate();

  return (
    <Screen
      header="Articles"
      activeNav="Content"
      contentWidth="1600px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Article" icon="plus-outline" modal={CreateArticleModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          {batch.size > 0 && (
            <BatchOperationsCard
              batch={batch}
              schema={response.getFromListAt('nodes', 0).schema()}
              onComplete={() => {
                batch.reset();
                run();
              }}
            />
          )}

          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> articles
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th><Input type="checkbox" checked={batch.hasAll()} onChange={batch.toggleAll} /></th>
                <th>Title</th>
                <th>Slotting</th>
                <th>Order Date</th>
                <th>Published At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => {
                const handleRowClick = createRowClickHandler(navigate, node);
                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
                    <td data-ignore-row-click><Input type="checkbox" onChange={() => batch.toggle(node)} checked={batch.has(node)} /></td>
                    <td>{node.get('title')}</td>
                    <td>
                      {node.has('slotting') ? Object.entries(node.get('slotting')).map(([key, slot]) => (
                        <span key={key}>{key}:{slot} </span>
                      )) : null}
                    </td>
                    <td className="text-nowrap">{formatDate(node.get('order_date'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('published_at'))}</td>
                    <td className="td-icons" data-ignore-row-click>
                      <Link to={nodeUrl(node, 'view')}>
                        <Button color="hover" tag="span">
                          <Icon imgSrc="eye" alt="view" />
                        </Button>
                      </Link>
                      {canUpdate && (
                        <Link to={nodeUrl(node, 'edit')}>
                          <Button color="hover" tag="span">
                            <Icon imgSrc="pencil" alt="edit" />
                          </Button>
                        </Link>
                      )}
                      <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
                        <Button color="hover" tag="span">
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

export default withRequest(withForm(SearchArticlesScreen), 'triniti:news:request:search-articles-request', {
  persist: true,
  initialData: {
    sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
    track_total_hits: true,
  }
});
