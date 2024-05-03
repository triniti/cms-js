import React from 'react';
import trim from 'lodash-es/trim.js';
import { Link } from 'react-router-dom';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';
import ObjectTable from '../object-table/index.js';

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
        return <Link to={url} target="_blank">{value}</Link>;
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
