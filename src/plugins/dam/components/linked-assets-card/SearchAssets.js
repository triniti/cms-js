import React, { useEffect } from 'react';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import { Loading, Pager, withForm } from '@triniti/cms/components/index.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import AssetTable from '@triniti/cms/plugins/dam/components/linked-assets-card/AssetTable.js';
import SearchForm from '@triniti/cms/plugins/dam/components/linked-assets-card/SearchForm.js';

function SearchAssets(props) {
  const { updateControls, searchEnricher, request, delegate } = props;
  const { response, pbjxError, isRunning, run } = useRequest(request, true, searchEnricher);
  const batch = useBatch(response);

  useEffect(() => {
    updateControls(batch, run);
  }, [batch.size]);

  return (
    <div id="asset-linker-search-body" className="scrollable-container bg-gray-400 modal-scrollable--tabs">
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <div>
          {!response.has('nodes') && (
            <p>No assets found.</p>
          )}

          {response.has('nodes') && (
            <AssetTable nodes={response.get('nodes')} batch={batch} />
          )}

          <Pager
            disabled={isRunning}
            hasMore={response.get('has_more')}
            page={request.get('page')}
            perPage={request.get('count')}
            total={response.get('total')}
            onChangePage={delegate.handleChangePage}
          />
        </div>
      )}
    </div>
  );
}

export default withRequest(withForm(SearchAssets), 'triniti:dam:request:search-assets-request', {
  channel: 'linker-search',
  initialData: {
    count: 30,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    track_total_hits: true,
  }
});
