import clamp from 'lodash-es/clamp.js';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import delay from '@triniti/cms/utils/delay.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import reorderGalleryAssets from '@triniti/cms/plugins/dam/actions/reorderGalleryAssets.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import useSequencer from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/useSequencer.js';

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

export default (props) => {
  const { nodeRef, editMode, request, tab } = props;
  request.set('gallery_ref', NodeRef.fromString(`${nodeRef}`));
  const { response, pbjxError, isRunning, run } = useRequest(request, tab === 'images');
  const dispatch = useDispatch();
  const policy = usePolicy();
  const batch = useBatch(response);
  const sequencer = useSequencer(response);

  const canPatch = policy.isGranted(`${APP_VENDOR}:image-asset:patch`);
  const canReorder = editMode && policy.isGranted('triniti:dam:command:reorder-gallery-assets');

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
      // delay to give time for all assets to be updated in elastic search.
      await delay(clamp(1000 * batch.size, 3000, 20000));
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
    request.set('page', 1);
    run();
  };

  const handleRefresh = () => {
    run();
  };

  const handleChangePage = (page) => {
    request.set('page', page);
    run();
    scrollToTop();
  };

  const handleReorderImages = async () => {
    try {
      await progressIndicator.show('Reordering Images...');
      const gallerySeqs = sequencer.results();
      await dispatch(reorderGalleryAssets(nodeRef, gallerySeqs));
      // delay to give time for all assets to be updated in elastic search.
      const count = Object.keys(gallerySeqs).length;
      await delay(clamp(1000 * count, 3000, 20000));
      await run();
      await progressIndicator.close();
      toast({ title: 'Images reordered.' });
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  return {
    batch,
    total: response ? response.get('total') : 0,
    canPatch,
    canReorder,
    handleChangePage,
    handleImagesAdded,
    handleRefresh,
    handleRemoveImages,
    handleReorderImages,
    ids: sequencer.ids,
    seqs: sequencer.seqs,
    images: sequencer.images,
    incrementer: sequencer.incrementer,
    isReordering: sequencer.isDirty,
    handleDragEnd: sequencer.handleDragEnd,
    handleRevertReordering: sequencer.handleRevert,
    response,
    pbjxError,
    isRunning,
  };
};
