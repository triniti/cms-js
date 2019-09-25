import Message from '@gdbots/pbj/Message';
import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

const TableBody = ({
  disabled, hasCheckboxes, onSelectRow, selectedRows, videos,
}) => (
  <tbody>
    {videos.map((video) => (
      <TableRow
        disabled={disabled}
        hasCheckboxes={hasCheckboxes}
        isSelected={selectedRows.some((item) => item.id === video.get('_id').toString())}
        key={video.get('_id')}
        onSelectRow={onSelectRow}
        video={video}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  videos: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

TableBody.defaultProps = {
  hasCheckboxes: true,
  disabled: false,
  selectedRows: [],
  videos: [],
};

export default TableBody;
