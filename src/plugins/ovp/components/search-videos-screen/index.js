import React, { lazy } from 'react';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/ovp/components/search-videos-screen/SearchForm.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

const CreateVideoModal = lazy(() => import('@triniti/cms/plugins/ovp/components/create-video-modal/index.js'));

function SearchVideosScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:video:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:video:update`);

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      header="Videos"
      activeNav="Content"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          {canCreate && <CreateModalButton text="Create Video" modal={CreateVideoModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} />

      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> videos
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table responsive>
              <thead>
              <tr>
                <th>Title</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th> </th>
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

export default withRequest(withForm(SearchVideosScreen), 'triniti:ovp:request:search-videos-request', {
  persist: true,
  initialData: {
    sort: SearchVideosSort.ORDER_DATE_DESC.getValue(),
  }
});
