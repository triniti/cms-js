import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchRedirectsSort from '@triniti/schemas/triniti/sys/enums/SearchRedirectsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/sys/components/search-redirects-screen/SearchForm.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateRedirectModal = lazy(() => import('@triniti/cms/plugins/sys/components/create-redirect-modal/index.js'));

function SearchRedirectsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:redirect:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:redirect:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Redirects"
      activeNav="Admin"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Redirect" icon="plus-outline" modal={CreateRedirectModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> redirects
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th>Request URI</th>
                <th>Redirect URI</th>
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
                    <td>{node.get('redirect_to')}</td>
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

export default withRequest(withForm(SearchRedirectsScreen), 'triniti:sys:request:search-redirects-request', {
  persist: true,
  initialData: {
    sort: SearchRedirectsSort.TITLE_ASC.getValue(),
    track_total_hits: true,
  }
});
