import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/apollo/components/search-polls-screen/SearchForm.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreatePollModal = lazy(() => import('@triniti/cms/plugins/apollo/components/create-poll-modal/index.js'));

function SearchPollsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:poll:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:poll:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Polls"
      activeNav="Content"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Poll" icon="plus-outline" modal={CreatePollModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> polls
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
              {response.get('nodes', []).map(node => {
                const handleRowClick = createRowClickHandler(navigate, node);

                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
                    <td>{node.get('title')}</td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
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

export default withRequest(withForm(SearchPollsScreen), 'triniti:apollo:request:search-polls-request', {
  persist: true,
  initialData: {
    sort: SearchPollsSort.CREATED_AT_DESC.getValue(),
    track_total_hits: true,
  }
});
