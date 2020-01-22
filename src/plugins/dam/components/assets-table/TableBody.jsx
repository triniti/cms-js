import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import TableRowAsset from './TableRowAsset';
import TableRowAudio from './TableRowAudio';
import TableRowImage from './TableRowImage';
import TableRowVideo from './TableRowVideo';

const TableBody = ({
  assets,
  currentlyPlayingAssetId,
  disabled,
  hasMasterCheckbox,
  onPlayerCommand,
  onSelectRow,
  selectedRows,
}) => (
  <tbody>
    {assets.map((asset) => {
      const schema = asset.schema();
      if (schema.hasMixin('triniti:dam:mixin:image-asset')) {
        return (
          <TableRowImage
            asset={asset}
            disabled={disabled}
            isSelected={selectedRows.some((item) => item.getId() === asset.get('_id').toString())}
            key={asset.get('_id')}
            onSelectRow={onSelectRow}
          />
        );
      }
      if (schema.hasMixin('triniti:dam:mixin:audio-asset')) {
        return (
          <TableRowAudio
            asset={asset}
            currentlyPlayingAssetId={currentlyPlayingAssetId}
            disabled={disabled}
            isSelected={selectedRows.some((item) => item.getId() === asset.get('_id').toString())}
            key={asset.get('_id')}
            onPlayerCommand={onPlayerCommand}
            onSelectRow={onSelectRow}
          />
        );
      }
      if (schema.hasMixin('triniti:dam:mixin:video-asset')) {
        return (
          <TableRowVideo
            asset={asset}
            currentlyPlayingAssetId={currentlyPlayingAssetId}
            disabled={disabled}
            isSelected={selectedRows.some((item) => item.getId() === asset.get('_id').toString())}
            key={asset.get('_id')}
            onPlayerCommand={onPlayerCommand}
            onSelectRow={onSelectRow}
          />
        );
      }
      return (
        <TableRowAsset
          asset={asset}
          disabled={disabled}
          isSelected={selectedRows.some((item) => item.getId() === asset.get('_id').toString())}
          key={asset.get('_id')}
          onSelectRow={onSelectRow}
        />
      );
    })}
  </tbody>
);

TableBody.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  currentlyPlayingAssetId: PropTypes.instanceOf(AssetId),
  disabled: PropTypes.bool,
  onPlayerCommand: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

TableBody.defaultProps = {
  currentlyPlayingAssetId: null,
  disabled: false,
  selectedRows: [],
};

export default TableBody;
