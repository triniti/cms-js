import React from 'react';
import PropertiesTable from '@triniti/cms/plugins/ncr/components/node-history-card/PropertiesTable';
import filterData from '@triniti/cms/plugins/ncr/components/node-history-card/filterData';
import findNodeDiff from '@triniti/cms/plugins/ncr/components/node-history-card/findNodeDiff';

export default function Event({ event }) {
  const schema = event.schema();

  if (schema.usesCurie('gdbots:ncr:mixin:node-updated')) {
    if (event.get('new_etag') === event.get('old_etag')) {
      return <div key="a"><strong className="text-black-50 ps-2 pe-2">No Changes</strong></div>;
    }

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

  if (schema.usesCurie('gdbots:ncr:event:node-created')) {
    return <PropertiesTable data={filterData(event.get('node').toObject())} />;
  }

  return <PropertiesTable data={filterData(event.toObject())} />;
}
