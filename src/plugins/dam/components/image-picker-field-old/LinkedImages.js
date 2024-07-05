import React, { useEffect } from 'react';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { ActionButton, Loading, withForm } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-grid/index.js';
import UploaderButton from '@triniti/cms/plugins/dam/components/uploader-button/index.js';
import Icon from '@triniti/cms/components/icon/index.js';
import noop from 'lodash-es/noop.js';

function LinkedImages(props) {
  const { request, nodeRef, selectActiveTab, selectImage, toggle, onUploadedImageComplete: handleUploadedImageComplete = noop} = props;
  const { response, pbjxError } = useRequest(request, true);

  useEffect(() => {
    if (!request || !nodeRef) {
      return noop;
    }

    request.set('linked_ref', NodeRef.fromString(nodeRef));
  }, [nodeRef, request]);

  return (
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
      {response && !response.has('nodes') && (
        <div className="not-found-message">
          No linked images found. You can
          <UploaderButton
            linkedRefs={[NodeRef.fromString(nodeRef)]}
            style={{ margin: "0 5px" }}
            color="light"
            outline
            allowMultiUpload={false}
            onClose={handleUploadedImageComplete}
            >
            <Icon imgSrc="upload" alt="upload" style={{ marginRight: "0.5rem" }} />
            upload
          </UploaderButton>
          <ActionButton
            text="search"
            icon="search"
            onClick={() => selectActiveTab('search-images')}
            style={{ margin: "0 5px" }}
            color="light"
            outline
          /> search to find unlink images.
        </div>
      )}
    </>
  );
}

export default withRequest(withForm(LinkedImages), 'triniti:dam:request:search-assets-request', {
  channel: 'picker',
  initialData: {
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    autocomplete: true,
  }
});
