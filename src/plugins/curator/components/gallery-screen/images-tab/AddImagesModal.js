import React, { lazy, Suspense, useState } from 'react';
import clamp from 'lodash-es/clamp.js';
import noop from 'lodash-es/noop.js';
import {
  Card,
  Col,
  Container,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledTooltip
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import {
  ActionButton,
  BackgroundImage,
  ErrorBoundary,
  Loading,
  Pager,
  withForm
} from '@triniti/cms/components/index.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import reorderGalleryAssets from '@triniti/cms/plugins/dam/actions/reorderGalleryAssets.js';
import delay from '@triniti/cms/utils/delay.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import SearchForm from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/SearchForm.js';

const UploaderModal = lazy(() => import('@triniti/cms/plugins/dam/components/uploader-modal/index.js'));

function AddImagesModal(props) {
  const { onClose = noop, galleryRef, gallerySeqIncrementer, request, delegate } = props;
  const dispatch = useDispatch();
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const { response, pbjxError, isRunning, run } = useRequest(
    request, !uploaderOpen, req => req.set('q', req.get('q', '') + ' +_missing_:gallery_ref')
  );
  const batch = useBatch(response);

  const handleClose = () => {
    onClose();
    props.toggle();
  };

  const handleUploaderDone = (ref, refs) => {
    if (!refs || !refs.length) {
      if (uploaderOpen) {
        setUploaderOpen(false);
      }
      return;
    }

    onClose();
    props.toggle();
  };

  const handleUpload = () => {
    setUploaderOpen(true);
  };

  const handleAddImages = async () => {
    try {
      await progressIndicator.show('Adding Images...');
      const gallerySeqs = {};
      for (const asset of batch.values()) {
        gallerySeqs[asset.get('_id').toString()] = gallerySeqIncrementer();
      }

      await dispatch(reorderGalleryAssets(galleryRef, gallerySeqs));
      // delay to give time for all assets to be updated in elastic search.
      await delay(clamp(500 * batch.size, 3000, 10000));
      run();
      await progressIndicator.close();
      toast({ title: 'Images added.' });
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  if (uploaderOpen) {
    return (
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <UploaderModal
            galleryRef={galleryRef}
            gallerySeqIncrementer={gallerySeqIncrementer}
            onDone={handleUploaderDone}
            toggle={handleUploaderDone}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Modal isOpen backdrop="static" size="xxl" centered>
      <ModalHeader toggle={handleClose}>Add Images</ModalHeader>
      <ModalBody className="p-0">
        <div id="asset-linker-search-body" className="scrollable-container modal-scrollable--tabs">
          <SearchForm {...props} isRunning={isRunning} run={run} />
          {(!response || pbjxError) && <Loading error={pbjxError} />}

          {response && (
            <div className="bg-gray-400">
              {!response.has('nodes') && (
                <p className="p-5">No images found.</p>
              )}

              {response.has('nodes') && (
                <Container fluid className="gallery-grid-container h-100">
                  <Row className="m-0 g-2">
                    {response.get('nodes').map(node => {
                      const id = node.get('_id');
                      const key = `image-${id.toString()}`;
                      const previewUrl = damUrl(id, '1by1', 'sm');
                      return (
                        <Col key={key} id={key} xs={12} sm={6} md={4} lg={3} xl="2p">
                          <Card
                            inverse
                            tag="button"
                            className={`p-1 mb-0 image-grid-card cursor-pointer ${batch.has(node) ? 'selected' : ''}`}
                            onClick={() => batch.toggle(node)}
                          >
                            <Media className="ratio ratio-1x1 mt-0 mb-0 border border-4 bg-dark">
                              <BackgroundImage imgSrc={previewUrl} alt="" />
                            </Media>
                          </Card>
                          <UncontrolledTooltip target={key} placement="bottom">
                            {node.get('title')}
                          </UncontrolledTooltip>
                        </Col>
                      );
                    })}
                  </Row>
                </Container>
              )}

              <Pager
                disabled={isRunning}
                hasMore={response.get('has_more')}
                page={request.get('page')}
                perPage={request.get('count')}
                total={response.get('total')}
                onChangePage={delegate.handleChangePage}
              />
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <ActionButton
          text="Upload"
          icon="cloud-upload"
          onClick={handleUpload}
          color="primary"
          tabIndex="-1"
        />

        {batch.size > 0 && (
          <ActionButton
            text={`Add Images (${batch.size})`}
            icon="plus-outline"
            color="primary"
            tabIndex="-1"
            onClick={handleAddImages}
          />
        )}

        <ActionButton
          text="Close"
          onClick={handleClose}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}

export default withRequest(withForm(AddImagesModal), 'triniti:dam:request:search-assets-request', {
  channel: 'modal',
  initialData: {
    count: 30,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    track_total_hits: true,
  }
});
