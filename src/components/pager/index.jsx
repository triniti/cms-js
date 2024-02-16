import React from 'react';
import clamp from 'lodash-es/clamp';
import { Button, ButtonGroup } from 'reactstrap';

const MAX_PAGE = 50;

export default function Pager(props) {
  const {
    disabled = false,
    hasMore = false,
    page = 1,
    perPage = 25,
    total = 0,
    onChangePage
  } = props;

  if (total < perPage) {
    return null;
  }

  const currentPage = clamp(page, 1, MAX_PAGE);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const totalPages = Math.ceil(total / perPage);

  const handleClickPrev = (e) => {
    e.preventDefault();
    onChangePage(prevPage);
  };

  const handleClickNext = (e) => {
    e.preventDefault();
    onChangePage(nextPage);
  };

  return (
    <div className="pager d-flex align-items-center">
      <ButtonGroup className="me-2">
        <Button outline onClick={handleClickPrev} disabled={disabled || !prevPage}>Prev</Button>
        <Button outline onClick={handleClickNext} disabled={disabled || !hasMore || nextPage > MAX_PAGE}>Next</Button>
      </ButtonGroup>
      <small className="text-dark">Page {currentPage} of {totalPages}</small>
    </div>
  );
}
