import React, { lazy } from 'react';
import { Button, Card, Media, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchPeopleSort from '@triniti/schemas/triniti/people/enums/SearchPeopleSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import brokenImage from '@triniti/cms/assets/img/broken-image--xs.jpg';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/people/components/search-people-screen/SearchForm.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreatePersonModal = lazy(() => import('@triniti/cms/plugins/people/components/create-person-modal/index.js'));

function SearchPeopleScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:person:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:person:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="People"
      activeNav="Taxonomy"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Person" icon="plus-outline" modal={CreatePersonModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> people
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th style={{ width: '32px' }} className="py-2 pe-1"></th>
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
                    <td className="text-center py-2 pe-1">
                      <Media
                        src={node.has('image_ref') ? damUrl(node.get('image_ref'), '1by1', 'xs') : brokenImage}
                        alt=""
                        width="32"
                        height="32"
                        object
                        className="rounded-2"
                      />
                    </td>
                    <td className="td-title">{node.get('title')}</td>
                    <td className="text-nowrap px-1 py-1"><Collaborators nodeRef={node.generateNodeRef().toString()} /></td>
                    <td className="td-date">{formatDate(node.get('created_at'))}</td>
                    <td className="td-date">{formatDate(node.get('updated_at'))}</td>
                    <td className="td-icons" data-ignore-row-click={true}>
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

export default withRequest(withForm(SearchPeopleScreen), 'triniti:people:request:search-people-request', {
  persist: true,
  initialData: {
    sort: SearchPeopleSort.TITLE_ASC.getValue(),
    track_total_hits: true,
  }
});
