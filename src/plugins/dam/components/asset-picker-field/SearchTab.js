import React from 'react';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import { Loading, Pager, withForm } from '@triniti/cms/components/index.js';
import AssetPresenter from '@triniti/cms/plugins/dam/components/asset-picker-field/AssetPresenter.js';
import SearchForm from '@triniti/cms/plugins/dam/components/asset-picker-field/SearchForm.js';

function SearchTab(props) {
  const { onSelectAsset, activeTab, type, searchEnricher, request, delegate, displayView } = props;
  request.clear('types').addToSet('types', [type]);
  const { response, pbjxError, isRunning, run } = useRequest(request, activeTab === 'search' || activeTab === 'gallery', searchEnricher);
  if (activeTab !== 'search' && activeTab !== 'gallery') {
    return null;
  }

  return (
    <div id="asset-picker-search-body" className="scrollable-container bg-gray-400 modal-scrollable--tabs">
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <div>
          {!response.has('nodes') && (
            <p className="p-5">No assets found.</p>
          )}

          {response.has('nodes') && (
            <AssetPresenter
              displayView={displayView}
              nodes={response.get('nodes')}
              type={type}
              onSelectAsset={onSelectAsset}
            />
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

export default withRequest(withForm(SearchTab), 'triniti:dam:request:search-assets-request', {
  channel: 'picker-search',
  initialData: {
    count: 30,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    track_total_hits: true,
  }
});
