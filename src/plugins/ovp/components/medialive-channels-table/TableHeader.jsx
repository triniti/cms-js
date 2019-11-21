import PropTypes from 'prop-types';
import React from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({
  onSort,
  sort,
}) => (
  <thead>
    <tr>
      <th className="w-50">
        Video Title
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchVideosSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchVideosSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Order Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchVideosSort.ORDER_DATE_ASC.getValue()}
          sortFieldDesc={SearchVideosSort.ORDER_DATE_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchVideosSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchVideosSort.PUBLISHED_AT_DESC.getValue()}
        />
      </th>
    </tr>
  </thead>
);

TableHeader.propTypes = {
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default TableHeader;
