import React from 'react';
import PropTypes from 'prop-types';

import MasterCheckbox from '@triniti/cms/components/master-checkbox';
import SearchPromotionsSort from '@triniti/schemas/triniti/curator/enums/SearchPromotionsSort';
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
          sortFieldAsc={SearchPromotionsSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchPromotionsSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPromotionsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchPromotionsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPromotionsSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchPromotionsSort.PUBLISHED_AT_DESC.getValue()}
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
