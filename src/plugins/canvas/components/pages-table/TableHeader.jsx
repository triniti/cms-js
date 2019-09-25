import React from 'react';
import PropTypes from 'prop-types';
import SortButton from '@triniti/cms/components/sort-button';
import SearchPagesSort from '@triniti/schemas/triniti/canvas/enums/SearchPagesSort';
import MasterCheckbox from '@triniti/cms/components/master-checkbox';

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
          sortFieldAsc={SearchPagesSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchPagesSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Order Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPagesSort.ORDER_DATE_ASC.getValue()}
          sortFieldDesc={SearchPagesSort.ORDER_DATE_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPagesSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchPagesSort.PUBLISHED_AT_DESC.getValue()}
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
