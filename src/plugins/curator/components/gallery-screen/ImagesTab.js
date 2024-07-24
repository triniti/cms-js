import React, { lazy, useMemo } from 'react';
import clamp from 'lodash-es/clamp.js';
import { Button, Card, CardBody, CardHeader, CardText, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import { ActionButton, CreateModalButton, Icon, Loading } from '@triniti/cms/components/index.js';
import delay from '@triniti/cms/utils/delay.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import incrementer from '@triniti/cms/utils/incrementer.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import reorderGalleryAssets from '@triniti/cms/plugins/dam/actions/reorderGalleryAssets.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import SortableImages from '@triniti/cms/plugins/curator/components/gallery-screen/SortableImages.js';

const AddImagesModal = lazy(() => import('@triniti/cms/plugins/curator/components/gallery-screen/AddImagesModal.js'));

const okayToRemove = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove them!',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return !!result.value;
};

const SEQ_STEP = 500;

function ImagesTab(props) {
  const { nodeRef, request, tab } = props;
  request.set('gallery_ref', NodeRef.fromString(`${nodeRef}`));
  const { response, pbjxError, isRunning, run } = useRequest(request, tab === 'images');
  const dispatch = useDispatch();
  const policy = usePolicy();
  const canUpdate = policy.isGranted('triniti:dam:command:reorder-gallery-assets');
  const batch = useBatch(response);
  const highestSeq = response
    && response.has('nodes')
    && response.getFromListAt('nodes', 0).get('gallery_seq', 0) || 0;

  const gallerySeqIncrementer = useMemo(() => {
    const start = highestSeq > 0 ? highestSeq + SEQ_STEP : 0;
    return incrementer(start, SEQ_STEP);
  }, [highestSeq]);

  const handleRemoveImages = async () => {
    if (!await okayToRemove()) {
      return;
    }

    try {
      await progressIndicator.show('Removing Images...');
      const gallerySeqs = {};
      const oldGalleryRefs = {};
      for (const asset of batch.values()) {
        const assetId = asset.get('_id').toString();
        gallerySeqs[assetId] = 0;
        oldGalleryRefs[assetId] = nodeRef;
      }
      await dispatch(reorderGalleryAssets(null, gallerySeqs, oldGalleryRefs));
      await delay(clamp(500 * batch.size, 3000, 10000)); // merely here to allow for all assets to be updated in elastic search.
      await run();
      await progressIndicator.close();
      toast({ title: 'Images removed.' });
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  const handleImagesAdded = () => {
    // note that the modal would have already done the adding
    run();
  };

  return (
    <Card>
      <CardHeader>
        <span>Images {isRunning && <Spinner />}</span>
        <span>
          {canUpdate && (
            <>
              {batch.size > 0 && (
                <ActionButton
                  text={`Remove Images (${batch.size})`}
                  icon="minus-outline"
                  size="sm"
                  color="danger"
                  onClick={handleRemoveImages}
                />
              )}
              <CreateModalButton
                text="Add Images"
                icon="plus-outline"
                size="sm"
                modal={AddImagesModal}
                modalProps={{
                  galleryRef: nodeRef,
                  gallerySeqIncrementer,
                  onClose: handleImagesAdded,
                }}
              />
            </>
          )}
          <Button color="light" size="sm" onClick={run} disabled={isRunning}>
            <Icon imgSrc="refresh" />
          </Button>
        </span>
      </CardHeader>
      <CardBody className="p-0">
        {(!response || pbjxError) && <Loading error={pbjxError} />}

        {response && !response.has('nodes') && (
          <CardText className="p-5">
            No images have been added to this gallery.
          </CardText>
        )}

        {response && response.has('nodes') && (
          <SortableImages response={response} batch={batch} />
        )}
      </CardBody>
    </Card>
  );
}

export default withRequest(ImagesTab, 'triniti:dam:request:search-assets-request', {
  channel: 'tab',
  initialData: {
    count: 255,
    sort: SearchAssetsSort.GALLERY_SEQ_DESC.getValue(),
    types: ['image-asset'],
    track_total_hits: true,
  }
});
