import React from 'react';
import PropTypes from 'prop-types';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import SortButton from '@triniti/cms/components/sort-button';
import MasterCheckbox from '@triniti/cms/components/master-checkbox';

const TableHeader = ({ areAllChecked, onChangeAllRows, onSort, sort }) => (
  <thead>
    <tr>
      <th>
        <MasterCheckbox
          checkAllLabel=""
          isSelected={areAllChecked}
          onChange={onChangeAllRows}
          uncheckAllLabel=""
        />
      </th>
      <th />
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
      <th>Mime Type</th>
      <th>File Size</th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchAssetsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchAssetsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th />
    </tr>
  </thead>
);

TableHeader.propTypes = {
  areAllChecked: PropTypes.bool.isRequired,
  onChangeAllRows: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default TableHeader;
