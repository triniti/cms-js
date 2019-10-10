/* eslint-disable no-plusplus */
import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as PaginationComponent } from '@triniti/admin-ui-plugin/components';
import Pager from './Pager';

const MAX_PAGER_NUM_TO_RENDER = 5;

const Pagination = ({
  perPage, className, currentPage, total, onChangePage, maxPager, first, last, 
}) => {
  if (total < perPage) {
    return null;
  }

  const totalPages = Math.ceil(total / perPage);
  const paginationItems = [];

  const start = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxPager / 2),
      totalPages - (maxPager - 1),
    ),
  );
  for (let i = start; i <= totalPages; i++) {
    const active = currentPage === i;
    const item = (
      <Pager
        active={active}
        key={i}
        text={`${i}`}
        onClick={(e) => {
          e.preventDefault();
          if (!active) {
            onChangePage(i);
          }
        }}
      />
    );
    paginationItems.push(item);

    if (paginationItems.length === maxPager) {
      break;
    }
  }

  return (
    <div className={`${className}`}>
      <PaginationComponent>
        { first && currentPage > 1
        && <Pager text="first" onClick={() => onChangePage(1)} />}
        { currentPage > 1
        && <Pager previous onClick={() => onChangePage(currentPage - 1)} />}

        {paginationItems}

        { currentPage < totalPages
        && <Pager next onClick={() => onChangePage(currentPage + 1)} />}
        { last && currentPage < totalPages
        && <Pager text="last" onClick={() => onChangePage(totalPages)} />}
      </PaginationComponent>
    </div>
  );
};

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  className: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  perPage: PropTypes.number,
  maxPager: PropTypes.number,
  first: PropTypes.bool,
  last: PropTypes.bool,
};

Pagination.defaultProps = {
  className: '',
  perPage: 25,
  maxPager: MAX_PAGER_NUM_TO_RENDER,
  first: true,
  last: true,
};

export default Pagination;
