/* eslint-disable import/no-cycle */
/* eslint-disable no-useless-escape */
/* eslint-disable no-empty */
import React from 'react';
import startCase from 'lodash/startCase';
import trim from 'lodash/trim';
import { RouterLink } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { expand } from '@gdbots/pbjx/pbjUrl';
import ObjectTable from '../object-table';

export const labelRenderer = ([key, ...parentKeys]) => <strong>{startCase(key)}</strong>;
export const valueRenderer = (field, value) => {
  // If field is a nodeRef then create link
  if (/^[\w\/\.:-]+$/.test(value)) {
    try {
      const nodeRef = NodeRef.fromString(value);
      const id = nodeRef.getId();
      const templateId = `${nodeRef.getQName()}.cms`;
      const url = expand(templateId, { _id: id });

      if (url) {
        return <RouterLink to={url} target="_blank">{value}</RouterLink>;
      }
    } catch (e) {}
  }
  if (value instanceof Object) {
    return <ObjectTable data={value} />;
  }
  return <span>{trim(value, '"')}</span>;
};
