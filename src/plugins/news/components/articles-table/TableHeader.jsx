import noop from 'lodash/noop';
import MasterCheckbox from '@triniti/cms/components/master-checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({
  areAllChecked,
  hasCheckboxes,
  onChangeAllRows,
  onSort,
  sort,
}) => (
  <thead>
    <tr>
      {
        hasCheckboxes
        && (
          <th>
            <MasterCheckbox
              checkAllLabel=""
              isSelected={areAllChecked}
              onChange={onChangeAllRows}
              uncheckAllLabel=""
            />
          </th>
        )
      }
      <th>
        Title
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchArticlesSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchArticlesSort.TITLE_DESC.getValue()}
        />
      </th>
      <th />
      <th>Slotting</th>
      <th>
        Order Date
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchArticlesSort.ORDER_DATE_ASC.getValue()}
          sortFieldDesc={SearchArticlesSort.ORDER_DATE_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchArticlesSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchArticlesSort.PUBLISHED_AT_DESC.getValue()}
        />
      </th>
      <th />
    </tr>
  </thead>
);

TableHeader.propTypes = {
  areAllChecked: PropTypes.bool,
  hasCheckboxes: PropTypes.bool.isRequired,
  onChangeAllRows: PropTypes.func,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

TableHeader.defaultProps = {
  areAllChecked: false,
  onChangeAllRows: noop,
};

export default TableHeader;
