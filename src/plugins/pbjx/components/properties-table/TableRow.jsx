import PropTypes from 'prop-types';
import React from 'react';
import { valueRenderer } from '../event-stream/dataRenderer';

const TableRow = ({ property }) => {
  const value = valueRenderer(property[0], property[1]);

  return <tr><th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>{property[0]}</th><td style={{ borderColor: '#efefef' }}>{value}</td></tr>;
};

TableRow.propTypes = {
  property: PropTypes.instanceOf(Object).isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TableRow;
