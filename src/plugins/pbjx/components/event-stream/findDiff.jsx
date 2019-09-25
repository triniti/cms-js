import React from 'react';
import omitBy from 'lodash/omitBy';
import VisualDiff from './VisualDiff';
import EventJsonTree from './EventJsonTree';
import prepareDelta from './prepareDelta';

/**
 * Keys that may not need for event stream difference
 */
const omitKeys = [
  'created_at',
  'creator_ref',
  'ctx_causator_ref',
  'ctx_correlator_ref',
  'ctx_cloud',
  'etag',
  'event_id',
  'last_event_ref',
  'occurred_at',
  'updated_at',
  'updater_ref',
  '_id',
  '_schema',
  'node_ref',
  'month_of_year',
  'day_of_month',
  'day_of_week',
  'is_weekend',
  'hour_of_day',
  'ts_ymdh',
  'ts_ymd',
  'ts_ym',
];

/**
 * filter out object keys that maynot need to display in event stream
 * @param data [object]
 */
const filterData = (data) => omitBy(data, (value, key) => omitKeys.includes(key));

export default (event) => {
  const schema = event.schema();
  // fixme:: definately need review here in the next step
  // not only this, the entire `event-stream` component
  if (schema.hasMixin('gdbots:ncr:mixin:node-updated')) {
    return <VisualDiff left={event.get('old_node').toObject()} right={event.get('new_node').toObject()} />;
  } if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted') || schema.hasMixin('gdbots:iam:mixin:user-roles-revoked')) {
    if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted')) {
      return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="bg-success text-white pl-2 pr-2">{nodeRef.id}</strong></div>);
    }

    return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="bg-danger text-white pl-2 pr-2"><del>{nodeRef.id}</del></strong></div>);
  } if (schema.hasMixin('gdbots:ncr:mixin:node-created')) {
    return <EventJsonTree data={filterData(event.get('node').toObject())} />;
  } if (schema.hasMixin('gdbots:ncr:mixin:node-renamed')) {
    return prepareDelta({ slug: [event.get('old_slug'), event.get('new_slug')] });
  }

  return <EventJsonTree data={filterData(event.toObject())} />;
};
