/* eslint-disable import/no-cycle */
/* eslint-disable no-useless-escape */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
import React from 'react';
import trim from 'lodash/trim';
import { RouterLink } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { expand } from '@gdbots/pbjx/pbjUrl';
import ObjectTable from '../object-table';

const URL_REGEX = /^(https?:\/\/[^\s]+)$/;
const NODEREF_REGEX = /^[\w\/\.:-]+$/;


const ValueRenderer = ({ value }) => {
  // If field is a nodeRef then create link
  if (NODEREF_REGEX.test(value)) {
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
  if (URL_REGEX.test(value)) {
    if (value.match(URL_REGEX)) {
      return <a href={value.match(URL_REGEX)[0]} rel="noopener noreferrer" target="_blank">{value.match(URL_REGEX)[0]}</a>;
    }
  }
  if (value instanceof Object) {
    return <ObjectTable data={value} />;
  }
  return <span>{trim(value, '"')}</span>;
};

export default ValueRenderer;
