import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchUsersSort from '@gdbots/schemas/gdbots/iam/enums/SearchUsersSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/iam/components/search-users-screen/SearchForm.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateUserModal = lazy(() => import('@triniti/cms/plugins/iam/components/create-user-modal/index.js'));

function SearchUsersScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:user:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:user:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Users"
      activeNav="Admin"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create User" icon="plus-outline" modal={CreateUserModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> users
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th>Name</th>
                <th></th>
                <th>Email</th>
                <th>Staff</th>
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
                    <td data-ignore-row-click><a href={`mailto:${node.get('email')}`} rel="noopener noreferrer">{node.get('email')}</a></td>
                    <td>{node.get('is_staff') ? 'Yes' : 'No'}</td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('updated_at'))}</td>
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

export default withRequest(withForm(SearchUsersScreen), 'gdbots:iam:request:search-users-request', {
  persist: true,
  initialData: {
    sort: SearchUsersSort.FIRST_NAME_ASC.getValue(),
    track_total_hits: true,
  }
});
