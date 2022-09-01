import React, { lazy } from 'react';
import { Badge, Button, Card, Media, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import damUrl from 'plugins/dam/damUrl';
import filesize from 'filesize';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useCuries from 'plugins/pbjx/components/useCuries';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import usePolicy from 'plugins/iam/components/usePolicy';
import SearchForm from 'plugins/dam/components/search-assets-screen/SearchForm';

//const CreateAssetModal = lazy(() => import('plugins/dam/components/create-asset-modal'));

function SearchAssetsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:asset:create`);

  const assetCuries = useCuries('triniti:dam:mixin:asset:v1');
  if (!assetCuries) {
    return null;
  }

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  return (
    <Screen
      title="Assets"
      header="Assets"
      contentWidth="1200px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} assetCuries={assetCuries} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> assets
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>
          <Card>
            <Table hover responsive>
              <thead>
                <tr>
                  <th></th>  
                  <th>Title</th>
                  <th>Mime type</th>
                  <th>File size</th>
                  <th>Created At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {response.get('nodes', []).map(node => {
                  const schema = node.schema();
                  const canUpdate = policy.isGranted(`${schema.getQName()}:update`);
                  return (
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                      <td>
                        {schema.getCurie().getMessage().replace('-asset', '') === 'image' && (
                          <Media
                            src={damUrl(node, '1by1', 'xs', null)}
                            alt=""
                            width="32"
                            height="32"
                            object
                            className="rounded-2"
                          />
                        )}
                      </td>  
                      <td>
                        {node.get('title')}
                        <Badge className="ms-1" color="light" pill>
                          {schema.getCurie().getMessage().replace('-asset', '')}
                        </Badge>
                      </td>
                      <td>{node.get('mime_type')}</td>
                      <td>{filesize(node.get('file_size'))}</td>
                      <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
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

export default withRequest(withForm(SearchAssetsScreen), 'triniti:dam:request:search-assets-request', {
  persist: true,
  initialData: {
    sort: SearchAssetsSort.RELEVANCE.getValue(),
  }
});
