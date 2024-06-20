import React from 'react';
import { Loading, withForm } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import SearchForm from '@triniti/cms/plugins/dam/components/asset-picker-field/SearchForm.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-grid/index.js';

function SearchAssets(props) {
  const { request, selectImage, toggle } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);

  return(
    <>
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && response.has('nodes') && (
        <ImageGrid
          nodes={response.get('nodes')}
          onSelectImage={(node) => {
            selectImage(node.generateNodeRef());
            toggle();
          }}
          selectedImages={[]}
          />
      )}
    </>
  );
}

export default withRequest(withForm(SearchAssets), 'triniti:dam:request:search-assets-request', {
  channel: 'picker',
  initialData: {
    count: 60,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    autocomplete: true,
  }
});
