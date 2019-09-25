import React from 'react';
import PropTypes from 'prop-types';
import { PaginationItem, PaginationLink } from '@triniti/admin-ui-plugin/components';

const Pager = ({ active, onClick, text, ...rest }) => (
  <PaginationItem active={active}>
    <PaginationLink onClick={onClick} {...rest}>
      {text}
    </PaginationLink>
  </PaginationItem>
);

Pager.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
};

Pager.defaultProps = {
  active: false,
  text: null,
};

export default Pager;
