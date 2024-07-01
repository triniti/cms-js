import omit from 'lodash-es/omit.js';

const omitKeys = [
  '_schema',
  'created_at',
  'creator_ref',
  'ctx_app',
  'ctx_causator_ref',
  'ctx_cloud',
  'ctx_correlator_ref',
  'ctx_ip',
  'ctx_ipv6',
  'ctx_tenant_id',
  'ctx_ua',
  'ctx_ua_parsed',
  'ctx_user_ref',
  'day_of_month',
  'day_of_week',
  'etag',
  'event_id',
  'hour_of_day',
  'is_weekend',
  'last_event_ref',
  'month_of_year',
  'node_ref',
  'occurred_at',
  'ts_ym',
  'ts_ymd',
  'ts_ymdh',
  'updated_at',
  'updater_ref',
];

/**
 * filter out object keys that may not need to display in event stream
 * @param data [object]
 */
export default (data) => omit(data, omitKeys);
