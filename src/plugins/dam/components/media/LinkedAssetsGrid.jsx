import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Col, Row } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

import EditButton from './EditButton';
import LinkedAssetsElement from './LinkedAssetsElement';
import UnlinkButton from './UnlinkButton';

const LinkedAssetsGrid = ({ nodes, onUnlinkAsset }) => (
  <Row gutter="sm">
    {nodes.map((asset) => (
      <Col key={`asset-node.${asset.get('_id').toString()}`} xs="12" sm="6" md="4">
        <LinkedAssetsElement
          asset={asset}
          toolBarButton={(
            <>
              <EditButton onEditAsset={() => window.open(pbjUrl(asset, 'cms'), '_blank')} />
              <UnlinkButton onUnlinkAsset={() => onUnlinkAsset(asset)} />
            </>
          )}
        />
      </Col>
    ))}
  </Row>
);

LinkedAssetsGrid.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  onUnlinkAsset: PropTypes.func.isRequired,
};

LinkedAssetsGrid.defaultProps = {
  nodes: [],
};

export default LinkedAssetsGrid;
