import React, { lazy, Suspense, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useDispatch } from 'react-redux';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import { ActionButton, ErrorBoundary, Loading, Pager, withForm } from '@triniti/cms/components/index.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import linkAssets from '@triniti/cms/plugins/dam/actions/linkAssets.js';
import delay from '@triniti/cms/utils/delay.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import AssetTable from '@triniti/cms/plugins/dam/components/linked-assets-card/AssetTable.js';
import SearchForm from '@triniti/cms/plugins/dam/components/linked-assets-card/SearchForm.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';

const UploaderModal = lazy(() => import('@triniti/cms/plugins/dam/components/uploader-modal/index.js'));

function LinkAssetsModal(props) {
  const {
    onClose = noop,
    linkedRef,
    uploaderProps = {},
    request,
    delegate
  } = props;

  const dispatch = useDispatch();
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const { response, pbjxError, isRunning, run } = useRequest(
    request, !uploaderOpen, req => req.set('q', req.get('q', '') + ` -linked_refs:${linkedRef}`)
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

  const handleLinkAssets = async () => {
    try {
      await progressIndicator.show('Linking Assets...');
      const assetRefs = Array.from(batch.values()).map(n => n.generateNodeRef());
      await dispatch(linkAssets(linkedRef, assetRefs));
      await delay(3000); // merely here to allow for all assets to be updated in elastic search.
      run();
      await progressIndicator.close();
      toast({ title: 'Assets linked.' });
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
            {...uploaderProps}
            linkedRef={linkedRef}
            onDone={handleUploaderDone}
            toggle={handleUploaderDone}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Modal isOpen backdrop="static" size="xl" centered>
      <ModalHeader toggle={handleClose}>Link Assets</ModalHeader>
      <ModalBody className="p-0">
        <div id="asset-linker-search-body" className="scrollable-container bg-gray-400 modal-scrollable--tabs">
          <SearchForm {...props} isRunning={isRunning} run={run} />
          {(!response || pbjxError) && <Loading error={pbjxError} />}

          {response && (
            <div>
              {!response.has('nodes') && (
                <p>No assets found.</p>
              )}

              {response.has('nodes') && (
                <AssetTable nodes={response.get('nodes')} batch={batch} />
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
            text={`Link Assets (${batch.size})`}
            icon="link"
            color="primary"
            tabIndex="-1"
            onClick={handleLinkAssets}
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

export default withRequest(withForm(LinkAssetsModal), 'triniti:dam:request:search-assets-request', {
  channel: 'modal',
  initialData: {
    count: 30,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    track_total_hits: true,
  }
});
