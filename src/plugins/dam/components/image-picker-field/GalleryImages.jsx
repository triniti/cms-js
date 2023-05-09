import React, { useEffect } from 'react';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { Loading, withForm } from 'components';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import ImageGrid from '../../../../plugins/dam/components/image-grid';

function GalleryImages(props) {
  const { request, nodeRef, selectImage, toggle } = props;
  const { response, pbjxError } = useRequest(request, true);

  useEffect(() => {
    if (!request || !nodeRef) {
      return;
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
