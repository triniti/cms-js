import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import startCase from 'lodash-es/startCase.js';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import { ErrorBoundary, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/dam/components/search-assets-screen/SearchForm.js';
import UploaderButton from '@triniti/cms/plugins/dam/components/uploader-button/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import BatchOperationsCard from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';
import useBatchSelection from '@triniti/cms/plugins/ncr/components/useBatchSelection.js';
import TranscodeableBadge from '@triniti/cms/plugins/dam/components/search-assets-screen/TranscodeableBadge.js';

//const CreateAssetModal = lazy(() => import('@triniti/cms/plugins/dam/components/create-asset-modal/index.js'));

function SearchAssetsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canDelete = policy.isGranted(`${APP_VENDOR}:asset:delete`);
  const nodes = response ? response.get('nodes', []) : [];
  const { allSelected, toggle, toggleAll, selected, setSelected, setAllSelected } = useBatchSelection(nodes);
  const navigate = useNavigate();

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
      components[label] = lazy(() => import(`@triniti/cms/plugins/dam/components/search-assets-screen/${file}Icon.js`));
      return components[label];
    };

  return (
    <Screen
      title="Assets"
      header="Assets"
      contentWidth="1600px"
      primaryActions={
        <>
          {isRunning && <Badge color="light" pill><span className="badge-animated">Searching</span></Badge>}
          <UploaderButton />
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} assetCuries={assetCuries} />

      <BatchOperationsCard
        run={run}
        selected={selected}
        setSelected={setSelected}
        setAllSelected={setAllSelected}
        nodes={nodes}
        canDelete={canDelete}
        canDraft={false}
        canPublish={false}
      />

      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> assets
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>
          <Card>
            <Table responsive>
              <thead>
                <tr>
                  <th><Input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
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
                    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`} role='button'>
                      <td><Input type="checkbox" onChange={() => toggle(`${node.get('_id')}`)} checked={selected.includes(`${node.get('_id')}`)} /></td>
                      <td>
                       {hasAssetIcon && (
                        <Suspense fallback={<Loading />}>
                          <ErrorBoundary>
                             <FieldsComponent asset={node} />
                          </ErrorBoundary>
                        </Suspense>
                       )}
                      </td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))}>
                        {node.get('title')}
                        <Collaborators nodeRef={NodeRef.fromNode(node)} />
                        <Badge className="ms-1" color="light" pill>
                          {schema.getCurie().getMessage().replace('-asset', '')}
                        </Badge>
                        {schema.hasMixin('triniti:ovp:mixin:transcodeable') && (<TranscodeableBadge asset={node} />)}
                      </td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.get('mime_type')}</td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))}>{formatBytes(node.get('file_size'))}</td>
                      <td onClick={() => navigate(nodeUrl(node, 'view'))} className="text-nowrap">{formatDate(node.get('created_at'))}</td>
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
