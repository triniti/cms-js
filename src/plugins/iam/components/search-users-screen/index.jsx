import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchUsersSort from '@gdbots/schemas/gdbots/iam/enums/SearchUsersSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import usePolicy from 'plugins/iam/components/usePolicy';
import SearchForm from 'plugins/iam/components/search-users-screen/SearchForm';

const CreateUserModal = lazy(() => import('plugins/iam/components/create-user-modal'));

function SearchUsersScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:user:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:user:update`);

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Users"
      header="Users"
      contentWidth="1200px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create User" modal={CreateUserModal} />}
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
            <Table responsive>
              <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Staff</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => (
                <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                  <td>{node.get('title')}</td>
                  <td><a href={`mailto:${node.get('email')}`} rel="noopener noreferrer">{node.get('email')}</a></td>
                  <td>{node.get('is_staff') ? 'Yes' : 'No'}</td>
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

export default withRequest(withForm(SearchUsersScreen), 'gdbots:iam:request:search-users-request', {
  persist: true,
  initialData: {
    sort: SearchUsersSort.FIRST_NAME_ASC.getValue(),
  }
});
