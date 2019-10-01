import noop from 'lodash/noop';
import React from 'react';
import PropTypes from 'prop-types';
import SortButton from '@triniti/cms/components/sort-button';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import MasterCheckbox from '@triniti/cms/components/master-checkbox';

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
      <th className="w-50">
        Title
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
      <th />
    </tr>
  </thead>
);

TableHeader.propTypes = {
  areAllChecked: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  onChangeAllRows: PropTypes.func,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

TableHeader.defaultProps = {
  areAllChecked: false,
  onChangeAllRows: noop,
  hasCheckboxes: true,
};

export default TableHeader;
