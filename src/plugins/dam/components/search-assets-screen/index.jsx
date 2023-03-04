import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { CreateModalButton, ErrorBoundary, Icon, Loading, Pager, Screen, withForm } from 'components';
import { scrollToTop } from 'components/screen';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useCuries from 'plugins/pbjx/components/useCuries';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import humanizeBytes from 'utils/humanizeBytes';
import usePolicy from 'plugins/iam/components/usePolicy';
import SearchForm from 'plugins/dam/components/search-assets-screen/SearchForm';
import UploaderButton from 'plugins/dam/components/uploader-button';
import Collaborators from 'plugins/raven/components/collaborators';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';


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

    const components = {};
    const resolveComponent = (label) => {
    if (components[label]) {
        return components[label];
    }

    const file = startCase(label).replace(/\s/g, '');
    components[label] = lazy(() => import(`./${file}Icon`));
    return components[label];
    };

  return (
    <Screen
      title="Assets"
      header="Assets"
      contentWidth="1200px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          <UploaderButton />
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
                  const label = schema.getCurie().getMessage();
                  const hasAssetIcon = label=== 'image-asset' || label === 'video-asset' || label==='audio-asset' ? true : false;
                  const FieldsComponent = resolveComponent(label);
                  const canUpdate = policy.isGranted(`${schema.getQName()}:update`);
                  return (
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                      <td>
                       {hasAssetIcon && (
                        <Suspense fallback={<Loading />}>
                          <ErrorBoundary>
                             <FieldsComponent asset={node} />
                          </ErrorBoundary>
                        </Suspense>
                       )}
                      </td>  
                      <td>
                        {node.get('title')}
                        <Collaborators nodeRef={NodeRef.fromNode(node)} />
                        <Badge className="ms-1" color="light" pill>
                          {schema.getCurie().getMessage().replace('-asset', '')}
                        </Badge>
                      </td>
                      <td>{node.get('mime_type')}</td>
                      <td>{humanizeBytes(node.get('file_size'))}</td>
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
