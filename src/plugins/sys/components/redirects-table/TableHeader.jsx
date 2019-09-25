import React from 'react';
import PropTypes from 'prop-types';

import SortButton from '@triniti/cms/components/sort-button';
import SearchRedirectsSort from '@triniti/schemas/triniti/sys/enums/SearchRedirectsSort';
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
        Request URI
      </th>
      <th>
        Redirect URI
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchRedirectsSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchRedirectsSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Updated At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchRedirectsSort.UPDATED_AT_ASC.getValue()}
          sortFieldDesc={SearchRedirectsSort.UPDATED_AT_DESC.getValue()}
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
