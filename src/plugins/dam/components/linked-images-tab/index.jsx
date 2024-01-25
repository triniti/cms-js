import React from 'react';
import { Button, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { Icon, Loading } from 'components';
import { Link } from 'react-router-dom';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import ImageGrid from '../../../../plugins/dam/components/image-grid';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import nodeUrl from 'plugins/ncr/nodeUrl';
import usePolicy from 'plugins/iam/components/usePolicy';

function LinkedImagesTab(props) {

  const { request, nodeRef } = props;
  request.set('linked_ref', NodeRef.fromString(nodeRef));
  
  const { response, pbjxError } = useRequest(request, true);
  const nodes = response ? response.get('nodes', []) : [];
  const policy = usePolicy();
  const canUpdate = policy.isGranted(`${APP_VENDOR}:asset:update`);

  return (
    <Card>
        <CardHeader>
          Linked Images
          {/* <Button onClick={this.handleToggleModal} className="mr-0 mt-2 mb-2">Link Images</Button> */}
        </CardHeader>
        <CardBody>
          {(!response || pbjxError) && <Loading error={pbjxError} />}
          {response && !nodes.length && <div className="not-found-message"><p>No linked images found.</p></div>}
          {/* <AssetLinkerModal
            assetTypes={[imageType]}
            isOpen={isModalOpen}
            nodeRef={nodeRef}
            onAssetUploaded={this.handleAssetsUploaded}
            onLinkAssets={this.handleLinkAssets}
            onToggleModal={this.handleToggleModal}
          />
          */}
          {nodes.length
          && (
            // <Row gutter="sm">
            //   {nodes.map((asset) => (
            //     <Col key={`asset-node.${asset.get('_id')}`} xs="12" sm="6" md="4">
            //       {console.log('adasdasd', asset)}
            //       {/* <Card className="mb-3">
            //         <CardBody>
            //           <img src={asset.get('image_ref').get('url')} alt={asset.get('title')} />
            //         </CardBody>
            //       </Card> */}
            //     </Col>
            //   ))}
            // </Row>
            <ImageGrid
              nodes={nodes}
              cardProps={{ className: 'mb-3' }}
              toolBarButtonRender={(node) => <>
                {canUpdate && (
                  <Link to={nodeUrl(node, 'edit')}>
                    <Button className="rounded-circle" outline size="sm">
                      <Icon imgSrc="pencil" alt="edit" />
                    </Button>
                  </Link>
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