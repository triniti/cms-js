import React, { lazy } from 'react';
import { Button, Card, CardHeader, CardBody } from 'reactstrap';
import { CreateModalButton, Icon, Loading, UncontrolledTooltip } from 'components';
import { Link } from 'react-router-dom';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import ImageGrid from '../../../../plugins/dam/components/image-grid';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import nodeUrl from 'plugins/ncr/nodeUrl';
import usePolicy from 'plugins/iam/components/usePolicy';
import Swal from 'sweetalert2';
import damUrl from 'plugins/dam/damUrl';
import { getInstance } from '@app/main';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import sendAlert from 'actions/sendAlert';
import { useDispatch } from 'react-redux';
import useFormContext from 'components/useFormContext';
import noop from 'lodash/noop';

const LinkAssetsModal = lazy(() => import('plugins/dam/components/link-assets-modal'));

const delay = (time = 500) => new Promise((resolve) => setTimeout(resolve, time));

const confirmUnlink = async (node) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to unlink ${node.get('title') || 'this image'}?`,
    icon: 'warning',
    imageUrl: damUrl(node),
    showCancelButton: true,
    confirmButtonText: 'Yes, unlink!',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary',
    },
  });
  return result.value;
}

function LinkedImagesTab(props) {

  const formContext = useFormContext();
  const { editMode } = formContext;

  const app = getInstance();
  const dispatch = useDispatch();
  const { request, nodeRef } = props;
  request.set('linked_ref', NodeRef.fromString(nodeRef));

  const { response, run: reloadMedia, pbjxError } = useRequest(request, true);
  const nodes = response ? response.get('nodes', []) : [];
  const policy = usePolicy();
  const canUpdate = policy.isGranted(`${APP_VENDOR}:asset:update`);

  const handleAddAssets = async (assets) => {
    try {
      const LinkAssetsV1 = await MessageResolver.resolveCurie(`${APP_VENDOR}:dam:command:link-assets:v1`);
      const command = LinkAssetsV1.create()
        .set('node_ref', NodeRef.fromString(nodeRef))
        .addToSet('asset_refs', assets.map((asset) => NodeRef.fromNode(asset)));
      
      const pbjx = await app.getPbjx();
      await pbjx.send(command);

      await delay(1000);
      dispatch(sendAlert({
        type: 'success',
        isDismissible: true,
        delay: 2000,
        message: 'Assets Added!',
      }));

      reloadMedia();
    } catch (e) {
      console.debug('Issue adding assets', e);
      // did not update, should restore tab
    }
  }

  const handleUnlink = node => async () => {
    if (!await confirmUnlink(node)) {
      return;
    }
    
    const UnlinkAssetsV1 = await MessageResolver.resolveCurie(`${APP_VENDOR}:dam:command:unlink-assets:v1`);
    const command = UnlinkAssetsV1.create()
      .set('node_ref', NodeRef.fromString(nodeRef))
      .addToSet('asset_refs', [NodeRef.fromNode(node)]);
    
    const pbjx = await app.getPbjx();
    await pbjx.send(command);
    await delay(1000);
    dispatch(sendAlert({
      type: 'success',
      isDismissible: true,
      delay: 2000,
      message: 'Asset Removed!',
    }));
  }

  return (
    <Card>
        <CardHeader className="pe-3">
          Linked Images
          <CreateModalButton
            disabled={!editMode}
            className="mt-2 mb-2"
            text="Link Images"
            modal={LinkAssetsModal}
            modalProps={{
              nodeRef,
              onAddAssets: handleAddAssets,
              onAssetsUploaded: () => reloadMedia,
              onCloseModal: noop,
              uploaderProps: {
                linkedRefs: [NodeRef.fromString(nodeRef)],
              },
              imageSearchProps: {
                excludedRef: NodeRef.fromString(nodeRef),
              },
            }}
            outline
          />
        </CardHeader>
        <CardBody>
          {(!response || pbjxError) && <Loading error={pbjxError} />}
          {response && !nodes.length && <div className="not-found-message"><p>No linked images found.</p></div>}
          {nodes.length > 0
          && (
            <ImageGrid
              nodes={nodes}
              colProps={{ xs: '12', sm: '6', md: '4' }}
              cardProps={{ className: 'mb-3 image-grid-card' }}
              toolBarButtonRender={(node) => <>
                {canUpdate && (
                  <>
                    <Link to={nodeUrl(node, 'edit')}>
                      <Button id="media-edit-button" className="rounded-circle me-2" outline size="sm">
                        <Icon imgSrc="pencil" alt="edit" />
                      </Button>
                      <UncontrolledTooltip placement="top" target="media-edit-button">Edit</UncontrolledTooltip>
                    </Link>
                    <Button id="media-link-button" className="rounded-circle" outline size="sm" onClick={handleUnlink(node)}>
                      <Icon imgSrc="unlink" alt="Unlink" />
                    </Button>
                  </>
                )}
              </>}
              />
          )}
        </CardBody>
      </Card>
  );
}

export default withRequest(LinkedImagesTab, 'triniti:dam:request:search-assets-request', {
  channel: 'media-search',
  persist: true,
  initialData: {
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    status: NodeStatus.PUBLISHED,
  }
});