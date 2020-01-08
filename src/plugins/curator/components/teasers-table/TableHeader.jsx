import React from 'react';
import PropTypes from 'prop-types';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';
import SortButton from '@triniti/cms/components/sort-button';
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
          sortFieldAsc={SearchTeasersSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchTeasersSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>Slotting</th>
      <th>
        Order Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchTeasersSort.ORDER_DATE_ASC.getValue()}
          sortFieldDesc={SearchTeasersSort.ORDER_DATE_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchTeasersSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchTeasersSort.PUBLISHED_AT_DESC.getValue()}
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
