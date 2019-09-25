import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import { Checkbox } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import TableRowIcons from './TableRowIcons';

const TableRowAsset = ({ asset, disabled, isSelected, onSelectRow }) => (
  <tr className={`status-${asset.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={asset.get('_id').toNodeRef().toString()}
        onChange={() => onSelectRow(asset.get('_id').toNodeRef())}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td />
    <td>
      {asset.get('title')}
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

TableRowAsset.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
};

TableRowAsset.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRowAsset;
