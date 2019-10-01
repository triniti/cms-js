import React from 'react';
import PropTypes from 'prop-types';

import SortButton from '@triniti/cms/components/sort-button';
import SearchPeopleSort from '@triniti/schemas/triniti/people/enums/SearchPeopleSort';
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
      <th />
      <th>
      Title
      &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPeopleSort.TITLE_ASC.getValue()}
          sortFieldDesc={SearchPeopleSort.TITLE_DESC.getValue()}
        />
      </th>
      <th>
        Slug
      </th>
      <th>
        Created At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPeopleSort.CREATED_AT_ASC.getValue()}
          sortFieldDesc={SearchPeopleSort.CREATED_AT_DESC.getValue()}
        />
      </th>
      <th>
        Updated At
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc={SearchPeopleSort.UPDATED_AT_ASC.getValue()}
          sortFieldDesc={SearchPeopleSort.UPDATED_AT_DESC.getValue()}
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
