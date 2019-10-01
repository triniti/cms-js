import PropTypes from 'prop-types';
import React from 'react';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({ onSort, sort }) => (
  <thead>
    <tr>
      <th>Title</th>
      <th>Type</th>
      <th>
        Creation Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchNotificationsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchNotificationsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Send At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchNotificationsSort.SEND_AT_ASC.getValue()}
          sortFieldDesc={SearchNotificationsSort.SEND_AT_DESC.getValue()}
        />
      </th>
      <th>
        Status
      </th>
      <th />
    </tr>
  </thead>
);

TableHeader.propTypes = {
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default TableHeader;
