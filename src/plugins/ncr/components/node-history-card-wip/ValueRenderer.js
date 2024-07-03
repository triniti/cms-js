import React from 'react';
import trim from 'lodash-es/trim.js';
import { Table } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';

const URL_REGEX = /^(https?:\/\/[^\s]+)$/;
const NODEREF_REGEX = /^[\w\/\.:-][^0-9]+$/;

export default function ValueRenderer({ value }) {
  // If field is a nodeRef then create link
  if (NODEREF_REGEX.test(value)) {
    try {
      const nodeRef = NodeRef.fromString(value);
      const id = nodeRef.getId();
      const label = nodeRef.getLabel();
      const url = expand('node.view', {
        label: label,
        _id: id,
      });

      return <a href={url} target="_blank">{value}</a>;
    } catch (e) {
    }
  }

  if (URL_REGEX.test(value)) {
    if (value.match(URL_REGEX)) {
      return <a href={value.match(URL_REGEX)[0]} rel="noopener noreferrer" target="_blank">{value.match(URL_REGEX)[0]}</a>;
    }
  }

  if (value instanceof Object) {
    return (
      <Table borderless size="sm">
        <tbody>
        {Object.entries(value).map(([label, value], idx) => (
          <tr key={idx}>
            <th>{label}</th>
            <td><ValueRenderer value={value} /></td>
          </tr>
        ))}
        </tbody>
      </Table>
    );
  }

  return <>{trim(value, '"')}</>;
};
