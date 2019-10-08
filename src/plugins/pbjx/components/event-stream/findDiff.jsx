import React from 'react';
import EventsTable from '../events-table';
import filterData from '../../utils/filterData';
import findNodeDiff from '../../utils/findNodeDiff';

export default (event) => {
  const schema = event.schema();
  // fixme:: definately need review here in the next step
  // not only this, the entire `event-stream` component
  if (schema.hasMixin('gdbots:ncr:mixin:node-updated')) {
    // return <VisualDiff left={event.get('old_node').toObject()} right={event.get('new_node').toObject()} />;
    // find properties in node that were removed
    const oldNodeKeys = Object.keys(event.get('old_node').toObject());
    const newNodeKeys = Object.keys(event.get('new_node').toObject());
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));
    const newNode = event.get('new_node').toObject();
    missingKeys.forEach((key) => {
      newNode[key] = null;
    });
    const diffNode = findNodeDiff(filterData(newNode), filterData(event.get('old_node').toObject()));
    return <EventsTable data={filterData(diffNode)} />;
  } if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted') || schema.hasMixin('gdbots:iam:mixin:user-roles-revoked')) {
    if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted')) {
      return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="text-black-50 pl-2 pr-2">{nodeRef.id}</strong></div>);
    }

    return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="text-black-50 pl-2 pr-2"><del>{nodeRef.id}</del></strong></div>);
  } if (schema.hasMixin('gdbots:ncr:mixin:node-created')) {
    return <EventsTable data={filterData(event.get('node').toObject())} />;
  } if (schema.hasMixin('gdbots:ncr:mixin:node-renamed')) {
    // return prepareDelta({ slug: [event.get('old_slug'), event.get('new_slug')] });
    return <EventsTable data={{ slug: event.get('new_slug') }} />;
  }

  return <EventsTable data={filterData(event.toObject())} />;
};
