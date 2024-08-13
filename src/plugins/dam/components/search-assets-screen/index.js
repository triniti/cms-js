import React, { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/dam/components/search-assets-screen/SearchForm.js';
import BatchOperationsCard from '@triniti/cms/plugins/dam/components/search-assets-screen/BatchOperationsCard.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import AssetIcon from '@triniti/cms/plugins/dam/components/asset-icon/index.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const UploaderModal = lazy(() => import('@triniti/cms/plugins/dam/components/uploader-modal/index.js'));

function SearchAssetsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:asset:create`);
  const batch = useBatch(response);
  const navigate = useNavigate();

  const curies = useCuries('triniti:dam:mixin:asset:v1');
  if (!curies) {
    return null;
  }

  return (
    <Screen
      header="Assets"
      contentWidth="1600px"
      primaryActions={
        <>
          {canCreate && (
            <CreateModalButton
              text="Upload Files"
              color="primary"
              icon="cloud-upload"
              modal={UploaderModal}
              modalProps={{
                onDone: (ref, refs) => {
                  if (!refs.length) {
                    return;
                  }

                  run();
                }
              }}
            />
          )}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} curies={curies} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          {batch.size > 0 && (
            <BatchOperationsCard
              batch={batch}
              schema={response.getFromListAt('nodes', 0).schema()}
              onComplete={() => {
                batch.reset();
                run();
              }}
            />
          )}

          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> assets
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th><Input type="checkbox" checked={batch.hasAll()} onChange={batch.toggleAll} /></th>
                <th style={{ width: '44px' }}></th>
                <th className="text-break w-100">Title</th>
                <th></th>
                <th className="d-none d-sm-table-cell">Mime Type</th>
                <th className="d-none d-sm-table-cell">File Size</th>
                <th className="d-none d-md-table-cell">Created At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => {
                const ref = node.generateNodeRef();
                const canUpdate = policy.isGranted(`${ref.getQName()}:update`);
                const seq = node.get('gallery_seq');
                const transcodingStatus = `${node.get('transcoding_status', '')}`;
                const handleRowClick = createRowClickHandler(navigate, node);

                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
                    <td data-ignore-row-click={true}><Input type="checkbox" onChange={() => batch.toggle(node)} checked={batch.has(node)} /></td>
                    <td data-ignore-row-click={true} className="text-center"><AssetIcon id={node.get('_id')} /></td>
                    <td className="text-break w-100">
                      {seq > 0 && (
                        <Badge pill color="light" className="me-1">Seq:{seq}</Badge>
                      )}
                      {node.get('title')}
                      {transcodingStatus && (
                        <Badge pill className={`ms-1 status-${transcodingStatus}`}>Transcoding:{transcodingStatus}</Badge>
                      )}
                    </td>
                    <td className="text-nowrap px-1 py-1"><Collaborators nodeRef={ref.toString()} /></td>
                    <td className="text-nowrap d-none d-sm-table-cell">{node.get('mime_type')}</td>
                    <td className="text-nowrap d-none d-sm-table-cell">{formatBytes(node.get('file_size'))}</td>
                    <td className="td-date d-none d-md-table-cell">{formatDate(node.get('created_at'))}</td>
                    <td data-ignore-row-click={true} className="td-icons">
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
                      <a href={damUrl(node.get('_id'))} target="_blank" rel="noopener noreferrer">
                        <Button color="hover" tag="span">
                          <Icon imgSrc="download" alt="download" />
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
    track_total_hits: true,
  }
});
