import React from 'react';
import noop from 'lodash/noop';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const DocumentAssetsTable = ({
  nodes,
  onSort,
  onSelectNode: handleSelectNode,
  sort,
  selectedNode,
}) => (
  <Card>
    <Table sticky="head" striped hover>
      <TableHeader
        sort={sort}
        onSort={onSort}
      />
      <TableBody
        nodes={nodes}
        onSelectNode={handleSelectNode}
        selectedNode={selectedNode}
      />
    </Table>
  </Card>
);

DocumentAssetsTable.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onSelectNode: PropTypes.func,
  onSort: PropTypes.func,
  selectedNode: PropTypes.instanceOf(Message),
  sort: PropTypes.string,
};

DocumentAssetsTable.defaultProps = {
  onSelectNode: noop,
  onSort: noop,
  selectedNode: null,
  sort: 'created-at-desc',
};

export default DocumentAssetsTable;
