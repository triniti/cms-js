import React, { useEffect } from 'react';
import { Card, CardImgOverlay, CardTitle, Col, Media, Row } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { ActionButton, Loading, withForm } from '@triniti/cms/components';
import damUrl from '@triniti/cms/plugins/dam/damUrl';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-grid';
import UploaderButton from '@triniti/cms/plugins/dam/components/uploader-button';
import Icon from '@triniti/cms/components/icon';
import noop from 'lodash-es/noop';

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
