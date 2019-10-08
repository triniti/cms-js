import React from 'react';
import startCase from 'lodash/startCase';
import trim from 'lodash/trim';
import TableRow from '../events-table/TableRow';
import ObjectTable from '../object-table';

// eslint-disable-next-line no-unused-vars
export const jsonTreeLabelRenderer = ([key, ...parentKeys]) => <strong>{startCase(key)}</strong>;
export const jsonTreeValueRenderer = (value, color) => {
  if (value instanceof Object) {
    return <ObjectTable data={value} />;
    // const properties = Object.entries(value);
    // return (properties.map((property) => (
    //   <TableRow
    //     property={property}
    //   />
    // )));
  }
  if (value === 'true') {
    return <strong className={`${color} text-black-50 pl-2 pr-2`}>Yes</strong>;
  }
  if (value === 'false') {
    return <strong className={`${color} text-black-50 pl-2 pr-2`}>No</strong>;
  }
  if (value === 'null') {
    return undefined;
  }
  return <strong className={`${color} text-black-50 pl-2 pr-2`}>{trim(value, '"')}</strong>;
};
