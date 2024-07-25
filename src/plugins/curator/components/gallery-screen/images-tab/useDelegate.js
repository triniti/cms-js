import { useEffect, useMemo, useState } from 'react';
import clamp from 'lodash-es/clamp.js';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import { arrayMove } from '@dnd-kit/sortable';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import delay from '@triniti/cms/utils/delay.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import incrementer from '@triniti/cms/utils/incrementer.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import reorderGalleryAssets from '@triniti/cms/plugins/dam/actions/reorderGalleryAssets.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';

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

export default (props) => {
  const { nodeRef, editMode, request, tab } = props;
  request.set('gallery_ref', NodeRef.fromString(`${nodeRef}`));
  const { response, pbjxError, isRunning, run } = useRequest(request, tab === 'images');
  const dispatch = useDispatch();
  const policy = usePolicy();
  const batch = useBatch(response);

  const canReorder = editMode && policy.isGranted('triniti:dam:command:reorder-gallery-assets');
  const highestSeq = response
    && response.has('nodes')
    && response.getFromListAt('nodes', 0).get('gallery_seq', 0) || 0;

  const gallerySeqIncrementer = useMemo(() => {
    const start = highestSeq > 0 ? highestSeq + SEQ_STEP : 0;
    return incrementer(start, SEQ_STEP);
  }, [highestSeq]);

  const initialSeq = useMemo(() => {
    if (!response) {
      return false;
    }

    let ids = [];
    const nodes = {};
    for (const node of response.get('nodes', [])) {
      const id = node.get('_id').toString();
      ids.push(id);
      nodes[id] = node;
    }

    return { ids, nodes };
  }, [response]);

  const [ids, setIds] = useState([]);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    if (!initialSeq) {
      return;
    }

    setIds([...initialSeq.ids]);
  }, [initialSeq]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);

    if (oldIndex !== newIndex) {
      const newIds = arrayMove(ids, oldIndex, newIndex);
      setIds(newIds);
      setIsReordering(!fastDeepEqual(initialSeq.ids, newIds));
    }
  };

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

  const handleRefresh = () => {
    run();
  };


  const handleReorderImages = async () => {

  };

  return {
    batch,
    ids: ids,
    nodes: initialSeq?.nodes || {},
    gallerySeqIncrementer,
    canReorder,
    isReordering,
    handleDragEnd,
    handleImagesAdded,
    handleRefresh,
    handleRemoveImages,
    handleReorderImages,
    total: response ? response.get('total') : 0,
    pbjxError,
    isRunning,
  };
};
