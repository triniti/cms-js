import PropTypes from 'prop-types';
import React from 'react';

import MasterCheckbox from '@triniti/cms/components/master-checkbox';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({
  areAllChecked,
  isBulkOperationEnabled,
  onChangeAllRows,
  onSort,
  sort,
}) => (
  <thead>
    <tr>
      {isBulkOperationEnabled
        && (
        <th>
          <MasterCheckbox
            checkAllLabel=""
            isSelected={areAllChecked}
            onChange={onChangeAllRows}
            uncheckAllLabel=""
          />
        </th>
        )}
      <th>
      Title
      &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPollsSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchPollsSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPollsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchPollsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Published At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPollsSort.PUBLISHED_AT_ASC.getValue()}
          sortFieldDesc={SearchPollsSort.PUBLISHED_AT_DESC.getValue()}
        />
      </th>
      {isBulkOperationEnabled && <th />}
    </tr>
  </thead>
);

TableHeader.propTypes = {
  areAllChecked: PropTypes.bool,
  isBulkOperationEnabled: PropTypes.bool,
  onChangeAllRows: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

TableHeader.defaultProps = {
  isBulkOperationEnabled: true,
  areAllChecked: false,
};

export default TableHeader;
