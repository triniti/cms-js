import noop from 'lodash-es/noop';
import React from 'react';
import { Loading, withForm } from 'components';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import ImageGrid from '../../../../plugins/dam/components/image-grid';
import SearchForm from 'plugins/dam/components/image-picker-field/SearchForm';

const GalleryGrid = (props) => {
  const {
    onSelectGallery: handleSelectGallery = noop,
    selectedGalleries = [],
    request,
  } = props;

  const { response, run, isRunning, pbjxError } = useRequest(request, true);

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