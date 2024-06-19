import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary, Icon, Loading, withForm } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import SearchForm from '@triniti/cms/plugins/dam/components/image-picker-field/SearchForm.js';
import { Badge, Button, Card, Table } from 'reactstrap';
import startCase from 'lodash-es/startCase.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

const components = {};

function SearchAssets(props) {
  const { assetType, request, searchQ, selectAsset, toggle } = props;
  const q = request.has('q') ? `${request.get('q', '')} ${searchQ}` : searchQ;
  request.set('q', q);
  request.addToSet('types', [ assetType ]);
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();

  const resolveComponent = (label) => {
    if (components[label]) {
        return components[label];
    }

    const file = startCase(label).replace(/\s/g, '');
    components[label] = lazy(() => import(`@triniti/cms/plugins/dam/components/search-assets-screen/${file}Icon.js`));
    return components[label];
  };

  return(
    <>
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && response.has('nodes') && (
        <>
        <Card>
          <Table responsive>
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
                const handleSelectAsset = () => {
                  selectAsset(node.generateNodeRef());
                  toggle();
                };
                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`} role="button">
                    <td>
                     {hasAssetIcon && (
                      <Suspense fallback={<Loading />}>
                        <ErrorBoundary>
                           <FieldsComponent asset={node} />
                        </ErrorBoundary>
                      </Suspense>
                     )}
                    </td>
                    <td onClick={handleSelectAsset}>
                      {node.get('title')}
                      <Collaborators nodeRef={NodeRef.fromNode(node)} />
                      <Badge className="ms-1" color="light" pill>
                        {schema.getCurie().getMessage().replace('-asset', '')}
                      </Badge>
                    </td>
                    <td onClick={handleSelectAsset}>{node.get('mime_type')}</td>
                    <td onClick={handleSelectAsset}>{formatBytes(node.get('file_size'))}</td>
                    <td onClick={handleSelectAsset} className="text-nowrap">{formatDate(node.get('created_at'))}</td>
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
                      <a href={damUrl(NodeRef.fromNode(node))} target="_blank" rel="noopener noreferrer">
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
      </>
      )}
    </>
  );
}

export default withRequest(withForm(SearchAssets), 'triniti:dam:request:search-assets-request', {
  channel: 'picker',
  initialData: {
    count: 25,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    autocomplete: true,
  }
});
