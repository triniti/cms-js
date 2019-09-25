import { components } from 'react-select';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';

const Menu = ({ children, existingNodes, isLoading, response, ...rest }) => {
  const total = response ? response.get('total') : 0;
  return (
    <div className="select__menu-outer">
      <div className="select__records text-left"><span>{total}</span> record{total !== 1 && 's'} found.</div>
      <components.Menu {...rest}>{children}</components.Menu>
    </div>
  );
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  existingNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  isLoading: PropTypes.bool.isRequired,
  response: PropTypes.instanceOf(Message),
};

Menu.defaultProps = {
  response: null,
};

export default Menu;
