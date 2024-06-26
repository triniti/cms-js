import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchPagesSort from '@triniti/schemas/triniti/canvas/enums/SearchPagesSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/canvas/components/search-pages-screen/SearchForm.js';

const CreatePageModal = lazy(() => import('@triniti/cms/plugins/canvas/components/create-page-modal/index.js'));

function SearchPagesScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:page:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:page:update`);

  return (
    <Screen
      header="Pages"
      activeNav="Content"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Page" icon="plus-outline" modal={CreatePageModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> pages
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th>Title</th>
                <th>Created At</th>
                <th>Published At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => (
                <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                  <td>{node.get('title')}</td>
                  <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                  <td className="text-nowrap">{formatDate(node.get('published_at'))}</td>
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

export default withRequest(withForm(SearchPagesScreen), 'triniti:canvas:request:search-pages-request', {
  persist: true,
  initialData: {
    sort: SearchPagesSort.TITLE_ASC.getValue(),
    track_total_hits: true,
  }
});
