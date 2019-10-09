import PropTypes from 'prop-types';
import React from 'react';
import { valueRenderer } from '../event-stream/dataRenderer';

const TableRow = ({ property }) => {
  const data = valueRenderer(property[0], property[1]);
  return (<tr className="table-dark"><td><strong className="text-black-50 pl-2 pr-2">{property[0]}</strong></td><td>{data}</td></tr>);
};

TableRow.propTypes = {
  property: PropTypes.instanceOf(Object).isRequired, // eslint-disable-line react/forbid-prop-types

};

export default TableRow;
