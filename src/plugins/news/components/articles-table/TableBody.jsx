import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({
  articles, disabled, hasCheckboxes, onSelectRow, selectedRows,
}) => (
  <tbody>
    {articles.map((article) => (
      <TableRow
        article={article}
        disabled={disabled}
        hasCheckboxes={hasCheckboxes}
        isSelected={selectedRows.some((item) => item.getId() === article.get('_id').toString())}
        key={article.get('_id')}
        onSelectRow={onSelectRow}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

TableBody.defaultProps = {
  articles: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
