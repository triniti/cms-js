import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import Message from '@gdbots/pbj/Message';
import { Button, Checkbox } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import TableRowIcons from './TableRowIcons';
import './styles.scss';

const TableRowVideo = ({
  asset,
  currentlyPlayingAssetId,
  disabled,
  isSelected,
  onPlayerCommand,
  onSelectRow,
}) => {
  const isPlaying = currentlyPlayingAssetId !== null && asset.get('_id').toString() === currentlyPlayingAssetId.toString();
  const buttonState = isPlaying ? 'active' : '';
  const command = isPlaying ? 'stop' : 'play';
  const transcodingStatus = asset.has('transcoding_status') ? asset.get('transcoding_status').getValue() : 'unknown';
  return (
    <tr className={`table-row-video status-${asset.get('status')}`}>
      <th scope="row">
        <Checkbox
          disabled={disabled}
          onChange={() => onSelectRow(asset.get('_id').toNodeRef())}
          checked={isSelected}
          size="sm"
        />
      </th>
      <td className="td-icons">
        <Button
          radius="circle"
          size="sm"
          color="hover"
          id={`button.${asset.get('_id').toString()}`}
          onClick={() => {
            onPlayerCommand(command, asset, 'video', { width: '100%', height: '100%' });
          }}
          className={`mt-1 mb-0 ${buttonState}`}
        >
          <span className="m-0 icon-toggle icon icon-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-3-6V8a.5.5 0 0 1 .736-.44l6.67 3.942a.5.5 0 0 1 .041.857l-6.67 4.058A.5.5 0 0 1 9 16z" /></svg>
          </span>
          <span className="m-0 icon-toggle icon icon-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7.5 7h2a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm7 0h2a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5z" /></svg>
          </span>
        </Button>
      </td>
      <td>
        {asset.get('title')}
        <small className={`text-uppercase status-copy mr-2 status-${transcodingStatus}`}>
          {transcodingStatus}
        </small>
        <Collaborators nodeRef={asset.get('_id').toNodeRef()} />
      </td>
      <td>{ asset.get('mime_type') }</td>
      <td>{ filesize(asset.get('file_size').toString(), { round: 1 }) }</td>
      <td className="text-nowrap">{ convertReadableTime(asset.get('created_at')) }</td>
      <td className="td-icons">
        <TableRowIcons asset={asset} />
      </td>
    </tr>
  );
};

TableRowVideo.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  onPlayerCommand: PropTypes.func.isRequired,
  currentlyPlayingAssetId: PropTypes.instanceOf(AssetId),
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
};

TableRowVideo.defaultProps = {
  currentlyPlayingAssetId: null,
  disabled: false,
  isSelected: false,
};

export default TableRowVideo;
