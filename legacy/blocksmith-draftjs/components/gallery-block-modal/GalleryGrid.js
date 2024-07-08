import noop from 'lodash-es/noop.js';
import React from 'react';
import { Loading, withForm } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import SearchForm from '@triniti/cms/plugins/dam/components/asset-picker-field/SearchForm.js';

const ImageGrid = () => null;

const GalleryGrid = (props) => {
  const {
    onSelectGallery: handleSelectGallery = noop,
    selectedGalleries = [],
    request,
  } = props;

  const { response, run, isRunning, pbjxError } = useRequest(request);

  return(
    <>
      <SearchForm {...props} isRunning={isRunning} run={run} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && response.has('nodes') && (
        <ImageGrid
          nodes={response.get('nodes')}
          onSelectImage={handleSelectGallery}
          selectedImages={selectedGalleries}
          />
      )}
      {response && !response.has('nodes') && (
        <div className="not-found-message">
          <p>No galleries found that match your search.</p>
        </div>
      )}
    </>
  );
};

export default withRequest(withForm(GalleryGrid), 'triniti:curator:request:search-galleries-request', {
  channel: 'blocksmith',
  persist: true,
});
