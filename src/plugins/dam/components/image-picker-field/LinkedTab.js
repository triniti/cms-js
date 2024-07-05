import React from 'react';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import { Loading } from '@triniti/cms/components/index.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-picker-field/ImageGrid.js';

function LinkedTab(props) {
  const { onSelectImage, onClickTab, onUpload, activeTab, linkedRef, request } = props;
  request.set('linked_ref', NodeRef.fromString(`${linkedRef}`));
  const { response, pbjxError } = useRequest(request, activeTab === 'linked');
  if (activeTab !== 'linked') {
    return null;
  }

  return (
    <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <div>
          {!response.has('nodes') && (
            <p>
              No linked images. You can
              <a onClick={onUpload}>upload</a> or
              <a onClick={onClickTab} data-tab="search">search</a>.
            </p>
          )}

          {response.has('nodes') && (
            <ImageGrid nodes={response.get('nodes')} onSelectImage={onSelectImage} />
          )}
        </div>
      )}
    </div>
  );
}

export default withRequest(LinkedTab, 'triniti:dam:request:search-assets-request', {
  channel: 'picker-linked',
  initialData: {
    count: 60,
    sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
    types: ['image-asset'],
    track_total_hits: false,
  }
});
