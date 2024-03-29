import React from 'react';
import { Loading, withForm } from 'components';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import SearchForm from 'plugins/dam/components/image-picker-field/SearchForm';
import ImageGrid from '../../../../plugins/dam/components/image-grid';

function SearchImages(props) {
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

export default withRequest(withForm(SearchImages), 'triniti:dam:request:search-assets-request', {
  channel: 'picker',
  initialData: {
    count: 60,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    autocomplete: true,
  }
});
