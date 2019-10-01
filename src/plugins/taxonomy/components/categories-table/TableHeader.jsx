import React from 'react';
import PropTypes from 'prop-types';
import SearchCategoriesSort from '@triniti/schemas/triniti/taxonomy/enums/SearchCategoriesSort';
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
          sortFieldAsc={SearchCategoriesSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchCategoriesSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchCategoriesSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchCategoriesSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Updated At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchCategoriesSort.UPDATED_AT_ASC.getValue()}
          sortFieldDesc={SearchCategoriesSort.UPDATED_AT_DESC.getValue()}
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
