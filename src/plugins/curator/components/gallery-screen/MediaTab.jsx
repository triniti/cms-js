import React, { lazy, useState } from 'react';
import pull from 'lodash/pull';
import pickBy from 'lodash/pickBy';
import noop from 'lodash-es/noop';
import isEqual from 'lodash-es/isEqual';
import swal from 'sweetalert2';
import { unstable_useBlocker } from 'react-router';
import { getInstance } from '@app/main';
import useRequest from 'plugins/pbjx/components/useRequest';
import useResolver from 'plugins/pbjx/components/with-request/useResolver';
import { CreateModalButton, Loading } from 'components';
import nodeUrl from 'plugins/ncr/nodeUrl';
import { useNavigate } from 'react-router-dom';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import ReorderGalleryAssetsV1 from '@triniti/schemas/triniti/dam/command/ReorderGalleryAssetsV1';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import sendAlert from 'actions/sendAlert';
import { useDispatch } from 'react-redux';
import progressIndicator from 'utils/progressIndicator';

import { Button, Card, Col, CardBody, CardHeader, CardFooter, Row } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl';
import Exception from '@gdbots/pbj/Exception';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import SortableGrid from 'plugins/curator/components/sortable-grid';
import BatchEditButton from 'plugins/dam/components/batch-edit-button';
import usePolicy from 'plugins/iam/components/usePolicy';

import getUpdatedNodeSequenceNumbers from './utils/getUpdatedNodeSequenceNumbers';
import moveNodeByGallerySequence from './utils/moveNodeByGallerySequence';
import moveNodeByIndex from './utils/moveNodeByIndex';
import ResizeGallerySlider from './ResizeGallerySlider';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { STATUS_FULFILLED } from 'constants';

const LinkAssetsModal = lazy(() => import('plugins/dam/components/link-assets-modal'));

const delay = (s) => new Promise((resolve) => setTimeout(resolve, s));

const MAX_IMAGES_PER_ROW = 11;
const MIN_IMAGES_PER_ROW = 1;
const MAX_NODES_COUNT_TO_UPDATE = 30;
const ADD_GALLERY_ASSET_INCREMENT = 500;

const cloneNodes = async (reOrderedNodes, originalNodes) => {
  if (reOrderedNodes.length) {
    return reOrderedNodes.slice();
  }
  const clonedNodes = [];
  for (let i = 0; i < originalNodes.length; i++) {
    clonedNodes.push(await originalNodes[i].clone());
  }
  return clonedNodes;
}

const areNodeListsEqual = (list1, list2) => {
  const nodeIds1 = list1.map(node => `${node.get('_id')}-${node.get('gallery_seq')}-${node.get('title')}`);
  const nodeIds2 = list2.map(node => `${node.get('_id')}-${node.get('gallery_seq')}-${node.get('title')}`);
  return isEqual(nodeIds1.sort(), nodeIds2.sort());
}

export default function GalleryMedia ({ editMode, nodeRef }) {
  const app = getInstance();
  const dispatch = useDispatch();
  const [imagesPerRow, setImagesPerRow] = useState(6);
  const [selected, setSelected] = useState([]);
  const [showGallerySequence, setShowGallerySequence] = useState(false);
  const [reorder, setReorder] = useState({ nodes: [], nodesToUpdate: null });
  const [nodes, setNodes] = useState([]);
  const policy = usePolicy();
  const isReorderGranted = policy.isGranted('*:dam:command:reorder-gallery-assets');
  const navigate = useNavigate();

  // TODO Need a strategy to warn users before they leave the page if they have unsaved changes.
  // const [ unblock, setUnblock ] = useRef(noop);
  // unstable_useBlocker(() => {
  //   const { delegate, history } = props;
  //   delegate.handleSearchGalleryAssets();
  //   unblock = history.block((location, action) => {
  //     const movedNodes = pickBy(
  //       reorder.nodesToUpdate || {},
  //       (sequence, id) => nodes.findIndex((node) => node.get('_id').toString() === id)
  //         !== reorder.nodes.findIndex((node) => node.get('_id').toString() === id),
  //     );
  //     if (Object.keys(movedNodes).length) {
  //       return 'You have unsaved changes. Are you sure you want to leave?';
  //     }
  //     return true;
  //   });
  // });
  
  const request = useResolver('*:dam:request:search-assets-request', {
    initialData: {
      gallery_ref: nodeRef,
      sort: SearchAssetsSort.GALLERY_SEQ_DESC,
      status: NodeStatus.PUBLISHED,
      types: ['image-asset'],
      count: 255
    }
  });

  const { response, pbjxError, pbjxStatus, run } = useRequest(request, true);
  if (
    pbjxStatus === STATUS_FULFILLED &&
    response &&
    !areNodeListsEqual(response.get('nodes'), nodes)
  ) {
    setNodes(response.get('nodes') || []);
  }

  const reloadMedia = () => {
    run();
    // setNodes([]);
    setReorder({ nodes: [], nodesToUpdate: null });
    setSelected([]);
  }

  const reorderGalleryAssets = async (assetsToUpdate) => {
    await progressIndicator.show('Reordering images...');
    try {
      const command = ReorderGalleryAssetsV1.create().set('gallery_ref', NodeRef.fromString(nodeRef));
      Object.keys(assetsToUpdate).map(k => command.addToMap('gallery_seqs', k, assetsToUpdate[k]));
      const pbjx = await app.getPbjx();
      await pbjx.send(command);
      await delay(2000);
      dispatch(sendAlert({
        type: 'success',
        isDismissible: true,
        delay: 1000,
        message: 'Asset moved!',
      }));
      await progressIndicator.close();
    } catch (error) {
      await progressIndicator.close();
      await Swal.fire({
        icon: 'warning',
        titleText: 'Image Move Failed.',
        text: 'Image was not moved. Please try again.',
        confirmButtonText: 'Continue',
        showCancelButton: false,
      });
    }
  };

  const handleAddAssets = async (selectedAssets) => {
    const assetMap = selectedAssets.reduce((obj, assetId, currentIndex) => {
      const assets = Object.assign(obj);
      assets[`${assetId.get('_id')}`] = lastGallerySequence + (selectedAssets.length - currentIndex) * ADD_GALLERY_ASSET_INCREMENT;
      return assets;
    }, {});

    try {
      await onAddAssets(assetMap);
    } catch (e) {
      // continue regardless of error
    }

    try {
      await reorderGalleryAssets(assetMap);
    } catch (e) {
      // did not update, should restore tab
    }
    
    await delay(3000);
    reloadMedia();
  }

  const handleDragEnd = async ({ active, over }) => {
    const activeId = active.id;
    const overId = over.id;
    if (overId === activeId) {
      return;
    }
    const nodesToUpdate = reorder.nodesToUpdate || {};
    const clonedNodes = await cloneNodes(reorder.nodes, nodes);
    const oldIndex = nodes.findIndex((node) => `${node.get('_id')}` === activeId);
    const newIndex = nodes.findIndex((node) => `${node.get('_id')}` === overId);
    const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(
      oldIndex,
      newIndex,
      clonedNodes,
    );
    const reorderedNodes = moveNodeByIndex(oldIndex, newIndex, clonedNodes);

    Object.keys(updatedNodeSequenceNumbers)
      .forEach((id) => reorderedNodes.find((node) => `${node.get('_id')}` === id)
        .set('gallery_seq', updatedNodeSequenceNumbers[id]));

    const newNodesToUpdate = pickBy(
      { ...nodesToUpdate, ...updatedNodeSequenceNumbers },
      (sequence, id) => nodes.find((node) => `${node.get('_id')}` === id).get('gallery_seq')
      !== reorderedNodes.find((node) => `${node.get('_id')}` === id).get('gallery_seq'),
    );
    const nodesToUpdateCount = Object.keys(newNodesToUpdate).length;
    setReorder({
      nodes: reorderedNodes,
      nodesToUpdate: nodesToUpdateCount ? newNodesToUpdate : null,
    });
    
    if (nodesToUpdateCount > MAX_NODES_COUNT_TO_UPDATE) {
      handleSubmitReorder();
    }
  }

  const handleEditAsset = async (asset) => {
    swal.fire({
      title: 'Continue?',
      html: `You will be navigated to <b>"${asset.get('title') || 'this image'}"</b>.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, continue!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-secondary',
      imageUrl: damUrl(asset, 'o', 'sm'),
      imageHeight: 150,
      imageAlt: `${asset.get('title') || 'image'}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.value) {
        await navigate(nodeUrl(asset, 'edit'));
      }
    });
  };

  const handleEditSequence = async (asset, seqSet) => {
    const { value: gallerySeq } = await swal.fire({
      title: 'Enter new sequence number',
      input: 'text',
      inputValue: asset.get('gallery_seq'),
      inputValidator: (value) => {
        if (!value) {
          return 'Sequence number is empty!';
        }

        if (seqSet.has(Number.parseInt(value, 10))) {
          return `${value} is already in use`;
        }

        if (value < 0) {
          return 'Please use a positive number sequence!';
        }

        return false;
      },
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonText: 'Update',
      imageUrl: damUrl(asset, 'o', 'sm'),
      imageHeight: 150,
      imageAlt: `${asset.get('title') || 'image'}`,
      reverseButtons: true,
    });

    if (!gallerySeq) {
      return;
    }

    const gallerySeqNumber = parseInt(gallerySeq, 10);
    const nodesToUpdate = reorder.nodesToUpdate || {};
    let clonedNodes = [];
    if (reorder.nodes.length) {
      clonedNodes = reorder.nodes.slice();
    } else {
      for (let i = 0; i < nodes.length; i++) {
        clonedNodes.push(await nodes[i].clone());
      }
    }
    const reorderedNodes = moveNodeByGallerySequence(gallerySeqNumber, asset, clonedNodes);

    reorderedNodes
      .find((node) => `${node.get('_id')}` === `${asset.get('_id')}`)
      .set('gallery_seq', gallerySeqNumber);

    const newNodesToUpdate = pickBy(
      { ...nodesToUpdate, ...{ [`${asset.get('_id')}`]: gallerySeqNumber } },
      (sequence, id) => nodes.find((node) => `${node.get('_id')}` === id).get('gallery_seq')
      !== reorderedNodes.find((node) => `${node.get('_id')}` === id).get('gallery_seq'),
    );

    const nodesToUpdateCount = Object.keys(newNodesToUpdate).length;
    setReorder({
      nodes: reorderedNodes,
      nodesToUpdate: nodesToUpdateCount ? newNodesToUpdate : null,
    });
    
    if (nodesToUpdateCount > MAX_NODES_COUNT_TO_UPDATE) {
      handleSubmitReorder();
    }
  }

  const handleRemoveAsset = async (asset) => {
    const { value } = await swal.fire({
      title: 'Are you sure?',
      html: `Do you want to remove <strong>"${asset.get('title') || 'this image'}"</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      imageUrl: damUrl(asset, 'o', 'sm'),
      imageHeight: 150,
      imageAlt: `${asset.get('title') || 'image'}`,
      reverseButtons: true,
    });

    if (!value) {
      return;
    }
    try {
      setSelected([...pull(selected, `${asset.get('_id')}`)]);
      const assetNodeRef =`${asset.get('_id')}`;
      const command = ReorderGalleryAssetsV1.create()
        .addToMap('gallery_seqs', assetNodeRef, 0)
        .addToMap('old_gallery_refs', assetNodeRef, NodeRef.fromString(nodeRef));
      const pbjx = await app.getPbjx();
      await pbjx.send(command);
      await delay(1000);
      dispatch(sendAlert({
        type: 'success',
        isDismissible: true,
        delay: 2000,
        message: 'Asset Removed!',
      }));
    } catch (error) {
      await swal.fire({
        icon: 'warning',
        titleText: 'Image Removal Failed.',
        text: 'Image was not removed.  Please try again.',
        confirmButtonText: 'Continue',
        showCancelButton: false,
      });
    }
    reloadMedia();
  };

  const handleSubmitReorder = async () => {
    if (!reorder.nodesToUpdate) {
      return;
    }

    try {
      await reorderGalleryAssets(reorder.nodesToUpdate);
    } catch (error) {
      // did not reordered
    }
    await delay(1000);
    reloadMedia();
  };

  const handleDecreaseImagesPerRow = () => {
    if (imagesPerRow > MIN_IMAGES_PER_ROW) {
      setImagesPerRow(imagesPerRow - 1);
    }
  }

  const handleIncreaseImagesPerRow = () => {
    if (imagesPerRow < MAX_IMAGES_PER_ROW) {
      setImagesPerRow(imagesPerRow + 1);
    }
  }

  const handleSlideImagesPerRow = (e) => {
    setImagesPerRow(parseFloat(e.target.value));
  }

  const handleChangeSearchParam = (key, value) => {
    const { delegate, searchNodesRequestState: { request } } = props;
    const newRequest = { ...request.toObject(), [key]: value };

    delete newRequest.request_id;
    delegate.handleSearchGalleryAssets(newRequest);
  }

  const handleSelect = (node) => {
    const nodeRefId = `${node.get('_id')}`;
    if (selected.indexOf(nodeRefId) > -1) {
      setSelected([...pull(selected, nodeRefId)]);
    } else {
      setSelected([...new Set([ ...selected, nodeRefId ])]);
    }
  }

  const handleAfterBatchEdit = async () => {
    await delay(2000);
    reloadMedia();
  }
  
  const { nodesToUpdate } = reorder;
  const nodesPreview = reorder.nodes.length ? reorder.nodes : nodes;
  const lastGallerySequence = nodesPreview.length ? nodesPreview[0].get('gallery_seq') : 0;

  const seqSet = new Set();
  const invalidSeqSet = new Set();
  nodesPreview.forEach((node) => {
    const sequence = node.get('gallery_seq');
    if (seqSet.has(sequence)) {
      invalidSeqSet.add(sequence);
    } else {
      seqSet.add(sequence);
    }
  });

  const movedNodes = pickBy(
    reorder.nodesToUpdate || {},
      (sequence, id) => nodes.findIndex((node) => `${node.get('_id')}` === id)
      !== reorder.nodes.findIndex((node) => `${node.get('_id')}` === id),
  );
  const movedNodesCount = Object.keys(movedNodes).length;

  return (
    <Card>
      <CardHeader>
        <span className="pr-4" style={{ minWidth: '130px' }}>Images { nodesPreview.length ? `(${nodesPreview.length})` : ''}</span>
        <ResizeGallerySlider
          imagesPerRow={imagesPerRow}
          maxImagesPerRow={MAX_IMAGES_PER_ROW}
          minImagesPerRow={MIN_IMAGES_PER_ROW}
          onDecreaseImagesPerRow={handleDecreaseImagesPerRow}
          onIncreaseImagesPerRow={handleIncreaseImagesPerRow}
          onSlideImagesPerRow={handleSlideImagesPerRow}
        />

        <div className="d-inline-flex flex-wrap justify-content-end ml-2 my-1">
          <BatchEditButton
            assetIds={selected}
            className="mt-2 mb-2"
            editMode={editMode}
            nodeRef={nodeRef}
            outline
            color="light"
            onAfterBatchEdit={handleAfterBatchEdit}
          />
          <CreateModalButton
            disabled={!editMode}
            className="mt-2 mb-2"
            text="Add Images"
            modal={LinkAssetsModal}
            modalProps={{
              nodeRef,
              actionBtnText: 'Add Image',
              onAddAssets: handleAddAssets,
              onAssetsUploaded: reloadMedia,
              onCloseModal: noop,
              imageSearchProps: {
                excludeAllWithRefType: 'gallery_ref',
              },
              uploaderProps: {
                galleryRef: nodeRef,
                lastGallerySequence,
              },
            }}
            outline
          />
          <Button
            onClick={handleSubmitReorder}
            disabled={!movedNodesCount}
            className="mt-2 mb-2"
            outline
            color="light"
          >
            Reorder Images
            {movedNodesCount ? <span className="badge bg-danger badge-alert">{Object.keys(nodesToUpdate || {}).length}</span> : null}
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Row gutter="sm">
          <Card>
            {(!response || pbjxError) && <Loading error={pbjxError} />}
            {response && !!nodesPreview.length && (
              <SortableGrid
                imagesPerRow={imagesPerRow}
                invalidSeqSet={invalidSeqSet}
                editMode={editMode}
                multiSelect
                onEditAsset={handleEditAsset}
                onRemoveAsset={handleRemoveAsset}
                onSelect={handleSelect}
                selected={selected}
                showEditSequence={showGallerySequence}
                onEditSequence={(asset) => handleEditSequence(asset, seqSet)}
                nodes={nodesPreview}
                onDragEnd={handleDragEnd}
              />
            )}
            {response && !nodesPreview.length && <div className="not-found-message"><p>No images found.</p></div>}
          </Card>
        </Row>
      </CardBody>
      {response && (
        <CardFooter>
          <Row>
            <Col md="9">
              {/* TODO */}
              {/* <Pagination
                currentPage={request.get('page') || 1}
                key="pager"
                onChangePage={(nextPage) => handleChangeSearchParam('page', nextPage)}
                perPage={1}
                total={response.get('total')}
              /> */}
            </Col>
            {isReorderGranted && (
              <Col md="3">
                <Button onClick={() => setShowGallerySequence(!showGallerySequence)} outline color="light">
                  {showGallerySequence ? 'Hide' : 'Show'} Gallery Sequence
                </Button>
              </Col>
            )}
          </Row>
        </CardFooter>
      )}
    </Card>
  );
}