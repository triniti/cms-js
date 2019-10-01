import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import VideoTableHeader from './TableHeader';
import VideoTableBody from './TableBody';

const VideosTable = ({
  areAllChecked,
  disabled,
  hasCheckboxes,
  nodes,
  onChangeAllRows,
  onSelectRow,
  onSort,
  selectedRows,
  sort,
  striped,
}) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive striped={striped}>
      <VideoTableHeader
        areAllChecked={areAllChecked}
        hasCheckboxes={hasCheckboxes}
        onChangeAllRows={onChangeAllRows}
        onSort={onSort}
        sort={sort}
      />
      <VideoTableBody
        disabled={disabled}
        hasCheckboxes={hasCheckboxes}
        onSelectRow={onSelectRow}
        selectedRows={selectedRows}
        videos={nodes}
      />
    </Table>
  </Card>
);

VideosTable.propTypes = {
  areAllChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  onChangeAllRows: PropTypes.func,
  onSelectRow: PropTypes.func,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
  striped: PropTypes.bool,
};

VideosTable.defaultProps = {
  areAllChecked: false,
  disabled: false,
  hasCheckboxes: true,
  nodes: [],
  onChangeAllRows: noop,
  onSelectRow: noop,
  selectedRows: [],
  striped: false,
};

export default VideosTable;
