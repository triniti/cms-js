import React from 'react';
import PropTypes from 'prop-types';
import SearchWidgetsSort from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({
  onSort,
  sort,
}) => (
  <thead>
    <tr>
      <th>
        Title
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchWidgetsSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchWidgetsSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchWidgetsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchWidgetsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Updated At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchWidgetsSort.UPDATED_AT_ASC.getValue()}
          sortFieldDesc={SearchWidgetsSort.UPDATED_AT_DESC.getValue()}
        />
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
