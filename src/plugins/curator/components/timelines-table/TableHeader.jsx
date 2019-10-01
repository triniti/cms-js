import React from 'react';
import PropTypes from 'prop-types';

import MasterCheckbox from '@triniti/cms/components/master-checkbox';
import SearchTimelinesSort from '@triniti/schemas/triniti/curator/enums/SearchTimelinesSort';
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
          sortFieldAsc={SearchTimelinesSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchTimelinesSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Order Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchTimelinesSort.ORDER_DATE_ASC.getValue()}
          sortFieldDesc={SearchTimelinesSort.ORDER_DATE_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchTimelinesSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchTimelinesSort.PUBLISHED_AT_DESC.getValue()}
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
