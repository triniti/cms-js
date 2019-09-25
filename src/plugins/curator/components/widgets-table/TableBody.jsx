import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({ history, nodes }) => (
  <tbody>
    {
      nodes.map((node) => (
        <TableRow
          history={history}
          key={node.get('_id')}
          node={node}
        />
      ))
    }
  </tbody>
);


TableBody.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

TableBody.defaultProps = {
  nodes: [],
};

export default TableBody;
