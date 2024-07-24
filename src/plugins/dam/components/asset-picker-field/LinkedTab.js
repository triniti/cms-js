import React from 'react';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import { Loading } from '@triniti/cms/components/index.js';
import AssetTable from '@triniti/cms/plugins/dam/components/asset-picker-field/AssetTable.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/ImageGrid.js';

function LinkedTab(props) {
  const { onSelectAsset, onClickTab, onUpload, searchEnricher, activeTab, linkedRef, type, request } = props;
  request.set('linked_ref', linkedRef ? NodeRef.fromString(`${linkedRef}`) : null);
  request.clear('types').addToSet('types', [type]);
  const { response, pbjxError } = useRequest(request, activeTab === 'linked', searchEnricher);
  if (activeTab !== 'linked') {
    return null;
  }

  const Component = type === 'image-asset' ? ImageGrid : AssetTable;

  return (
    <div className="scrollable-container bg-gray-400 modal-scrollable--tabs">
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <div>
          {!response.has('nodes') && (
            <p className="p-4">
              No linked assets. You can <a className="text-underline" onClick={onUpload}>upload</a> or <a className="text-underline" onClick={onClickTab} data-tab="search">search</a>.
            </p>
          )}

          {response.has('nodes') && (
            <Component nodes={response.get('nodes')} onSelectAsset={onSelectAsset} />
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
    track_total_hits: false,
  }
});
