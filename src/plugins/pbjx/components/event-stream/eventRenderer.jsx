import React from 'react';
import PropertiesTable from '../properties-table';
import filterData from '../../utils/filterData';
import findNodeDiff from '../../utils/findNodeDiff';

export default (event) => {
  const schema = event.schema();
  if (schema.hasMixin('gdbots:ncr:mixin:node-updated')) {
    // find properties in node that were removed
    const oldNodeKeys = Object.keys(event.get('old_node').toObject());
    const newNodeKeys = Object.keys(event.get('new_node').toObject());
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));
    const newNode = event.get('new_node').toObject();
    missingKeys.forEach((key) => {
      newNode[key] = null;
    });
    const diffNode = findNodeDiff(filterData(newNode), filterData(event.get('old_node').toObject()));
    return <PropertiesTable data={filterData(diffNode)} />;
  }
  if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted') || schema.hasMixin('gdbots:iam:mixin:user-roles-revoked')) {
    if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted')) {
      return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="text-black-50 pl-2 pr-2">{nodeRef.id}</strong></div>);
    }
    return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="text-black-50 pl-2 pr-2"><del>{nodeRef.id}</del></strong></div>);
  }
  if (schema.hasMixin('gdbots:ncr:mixin:node-created')) {
    return <PropertiesTable data={filterData(event.get('node').toObject())} />;
  }
  if (schema.hasMixin('gdbots:ncr:mixin:node-renamed')) {
    // return prepareDelta({ slug: [event.get('old_slug'), event.get('new_slug')] });
    return <PropertiesTable data={{ slug: event.get('new_slug') }} />;
  }
  return <PropertiesTable data={filterData(event.toObject())} />;
};
