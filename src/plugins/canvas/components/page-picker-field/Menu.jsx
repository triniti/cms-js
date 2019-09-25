import { components } from 'react-select';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';

const Menu = ({ children, existingNodes, isLoading, response, ...rest }) => {
  let nodes = existingNodes;
  if (!isLoading) {
    nodes = nodes.concat(!response ? [] : response.get('nodes', []));
  }
  const total = response ? response.get('total') : 0;
  const currentListing = nodes.length;
  return (
    <div className="select__menu-outer">
      <div className="select__records"><span>{total}</span> records found. ({currentListing}/{total})</div>
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
