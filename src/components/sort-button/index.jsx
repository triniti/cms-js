import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const SortButton = ({
  currentSort,
  onSort,
  sortFieldAsc,
  sortFieldDesc,
}) => (
  <span>
    {(currentSort !== sortFieldAsc && currentSort !== sortFieldDesc) && (
    <Icon
      style={{ cursor: 'pointer', verticalAlign: 'middle' }}
      imgSrc="sort"
      id={sortFieldAsc + sortFieldDesc}
      onClick={() => {
        onSort(currentSort === sortFieldAsc ? sortFieldDesc : sortFieldAsc);
      }}
    />
    )}
    {(currentSort !== sortFieldAsc && currentSort !== sortFieldDesc)
    && <UncontrolledTooltip placement="top" target={sortFieldAsc + sortFieldDesc}>Sort</UncontrolledTooltip>}
    {currentSort === sortFieldDesc && (
    <Icon
      style={{ cursor: 'pointer', verticalAlign: 'middle' }}
      imgSrc="caret-up"
      id="caret-up"
      onClick={() => {
        onSort(sortFieldAsc);
      }}
    />
    )}
    {currentSort === sortFieldDesc
    && <UncontrolledTooltip placement="top" target="caret-up">Ascending</UncontrolledTooltip>}
    {currentSort === sortFieldAsc && (
    <Icon
      style={{ cursor: 'pointer', verticalAlign: 'middle' }}
      imgSrc="caret-down"
      id="caret-down"
      onClick={() => {
        onSort(sortFieldDesc);
      }}
    />
    )}
    {currentSort === sortFieldAsc
    && <UncontrolledTooltip placement="top" target="caret-down">Descending</UncontrolledTooltip>}
  </span>
);

SortButton.propTypes = {
  currentSort: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  sortFieldAsc: PropTypes.string.isRequired,
  sortFieldDesc: PropTypes.string.isRequired,
};

export default SortButton;
