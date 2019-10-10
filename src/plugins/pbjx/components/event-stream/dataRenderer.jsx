import React from 'react';
import startCase from 'lodash/startCase';
import trim from 'lodash/trim';
import { RouterLink } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { expand } from '@gdbots/pbjx/pbjUrl';
import DataTable from '../data-table';

export const labelRenderer = ([key, ...parentKeys]) => <strong>{startCase(key)}</strong>;
export const valueRenderer = (field, value, color) => {
  // If field is a nodeRef then create link
  if (field.endsWith('_ref') && value) {
    const nodeRef = NodeRef.fromString(value);
    const id = nodeRef.getId();
    const templateId = `${nodeRef.getQName()}.cms`;
    const url = expand(templateId, { _id: id });
    return <strong className={`${color} text-black-50 pl-2 pr-2`}><RouterLink to={url} target="_black">{value}</RouterLink></strong>;
  }
  if (value instanceof Object) {
    return <DataTable data={value} />;
  }
  return <strong className={`${color} text-black-50 pl-2 pr-2`}>{trim(value, '"')}</strong>;
};
