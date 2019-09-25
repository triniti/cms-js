import MasterCheckbox from '@triniti/cms/components/master-checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort';
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
          sortFieldAsc={SearchGalleriesSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchGalleriesSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Order Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchGalleriesSort.ORDER_DATE_ASC.getValue()}
          sortFieldDesc={SearchGalleriesSort.ORDER_DATE_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchGalleriesSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchGalleriesSort.PUBLISHED_AT_DESC.getValue()}
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
