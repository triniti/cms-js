import React, { useEffect } from 'react';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { Loading, withForm } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-grid-old/index.js';
import noop from 'lodash-es/noop.js';

function GalleryImages(props) {
  const { request, nodeRef, selectImage, toggle } = props;
  const { response, pbjxError } = useRequest(request);

  useEffect(() => {
    if (!request || !nodeRef) {
      return noop;
    }

    request.set('gallery_ref', NodeRef.fromString(nodeRef));
  }, [nodeRef, request]);

  return(
    <>
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && response.has('nodes') && (
        <ImageGrid
          nodes={response.get('nodes')}
          onSelectImage={(node) => {
            selectImage(node.generateNodeRef());
            toggle();
          }}
          />
      )}
    </>
  );
}

export default withRequest(withForm(GalleryImages), 'triniti:dam:request:search-assets-request', {
  count: 150,
  channel: 'picker',
  initialData: {
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    autocomplete: true,
  }
});
