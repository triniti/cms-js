import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader, CardText, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import { ActionButton, CreateModalButton, Icon, Loading } from '@triniti/cms/components/index.js';
import delay from '@triniti/cms/utils/delay.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import unlinkAssets from '@triniti/cms/plugins/dam/actions/unlinkAssets.js';
import AssetTable from '@triniti/cms/plugins/dam/components/linked-assets-card/AssetTable.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';

const LinkAssetsModal = lazy(() => import('@triniti/cms/plugins/dam/components/linked-assets-card/LinkAssetsModal.js'));

const okayToUnlink = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, unlink them!',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return !!result.value;
};

function LinkedAssetsCard(props) {
  const { linkedRef, request } = props;
  request.set('linked_ref', NodeRef.fromString(`${linkedRef}`));
  const { response, pbjxError, isRunning, run } = useRequest(request);
  const dispatch = useDispatch();
  const policy = usePolicy();
  const canLink = policy.isGranted('triniti:dam:command:link-assets');
  const canUnlink = policy.isGranted('triniti:dam:command:unlink-assets');
  const batch = useBatch(response);

  const handleUnlinkAssets = async () => {
    if (!await okayToUnlink()) {
      return;
    }

    try {
      await progressIndicator.show('Unlinking Assets...');
      const assetRefs = Array.from(batch.values()).map(n => n.generateNodeRef());
      await dispatch(unlinkAssets(linkedRef, assetRefs));
      await delay(3000); // merely here to allow for all assets to be updated in elastic search.
      await run();
      await progressIndicator.close();
      toast({ title: 'Assets unlinked.' });
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  const handleLinkedAssets = () => {
    // note that the modal would have already done the linking
    run();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <span>Linked Assets {isRunning && <Spinner />}</span>
          <span>
            {canUnlink && batch.size > 0 && (
              <ActionButton
                text={`Unlink Assets (${batch.size})`}
                icon="unlink"
                size="sm"
                color="danger"
                onClick={handleUnlinkAssets}
              />
            )}
            {canLink && (
              <CreateModalButton
                text="Link Assets"
                icon="link"
                size="sm"
                modal={LinkAssetsModal}
                modalProps={{
                  linkedRef,
                  onClose: handleLinkedAssets,
                }}
              />
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
              No assets have been linked to this {request.get('linked_ref').getLabel()}.
            </CardText>
          )}

          {response && response.has('nodes') && (
            <AssetTable nodes={response.get('nodes')} batch={batch} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default withRequest(LinkedAssetsCard, 'triniti:dam:request:search-assets-request', {
  channel: 'tab',
  initialData: {
    count: 100,
    sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
    track_total_hits: false,
  }
});
