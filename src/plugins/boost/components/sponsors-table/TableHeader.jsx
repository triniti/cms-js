import PropTypes from 'prop-types';
import React from 'react';
import MasterCheckbox from '@triniti/cms/components/master-checkbox';
import SearchSponsorsSort from '@triniti/schemas/triniti/boost/enums/SearchSponsorsSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({
  areAllChecked,
  onChangeAllRows,
  onSort,
  sort,
}) => (
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
      <th>
      Title
      &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchSponsorsSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchSponsorsSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchSponsorsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchSponsorsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchSponsorsSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchSponsorsSort.PUBLISHED_AT_DESC.getValue()}
        />
      </th>
      <th />
    </tr>
  </thead>
);

TableHeader.propTypes = {
  areAllChecked: PropTypes.bool,
  onChangeAllRows: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

TableHeader.defaultProps = {
  areAllChecked: false,
};

export default TableHeader;
