import React from 'react';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import { Loading, Pager, withForm } from '@triniti/cms/components/index.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-picker-field/ImageGrid.js';
import SearchForm from '@triniti/cms/plugins/dam/components/image-picker-field/SearchForm.js';

function SearchTab(props) {
  const { onSelectImage, activeTab, request, delegate } = props;
  const { response, pbjxError, isRunning, run } = useRequest(request, activeTab === 'search');
  if (activeTab !== 'search') {
    return null;
  }

  return (
    <div id="image-picker-search-body" className="scrollable-container bg-gray-400 modal-scrollable--tabs">
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <div>
          {!response.has('nodes') && (
            <p>No images found.</p>
          )}

          {response.has('nodes') && (
            <ImageGrid nodes={response.get('nodes')} onSelectImage={onSelectImage} />
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
    types: ['image-asset'],
    track_total_hits: true,
  }
});
