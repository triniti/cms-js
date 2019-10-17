import React from 'react';
import PropTypes from 'prop-types';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({ onSort, sort }) => (
  <thead>
    <tr>
      <th>
        Title
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchAssetsSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchAssetsSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Created
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchAssetsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchAssetsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Mime Type
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchAssetsSort.MIME_TYPE_ASC.getValue()}
          sortFieldDesc={SearchAssetsSort.MIME_TYPE_DESC.getValue()}
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
