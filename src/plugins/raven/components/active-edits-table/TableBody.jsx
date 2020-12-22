import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Message from '@gdbots/pbj/Message';

import TableRow from './TableRow';

const TableBody = ({ nodes }) => (
  <tbody>
    {!nodes.length && (<tr><td /><td>No Content being collaborated on.</td></tr>)}
    {nodes.map((node, idx) => (
      <TableRow node={node} idx={idx} key={node.get('_id')} />
    ))}
  </tbody>
);

TableBody.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

// DO NOT refresh when user is hovered over AND if NO status update
const isMemo = ({ status: prevStatus }, { isHover, status }) => isHover && (prevStatus === status);

export default memo(TableBody, isMemo);
