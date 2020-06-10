import omitBy from 'lodash/omitBy';

const omitKeys = [
  'created_at',
  'creator_ref',
  'ctx_app',
  'ctx_causator_ref',
  'ctx_correlator_ref',
  'ctx_cloud',
  'ctx_ip',
  'ctx_ua',
  'ctx_user_ref',
  'etag',
  'event_id',
  'last_event_ref',
  'occurred_at',
  'updated_at',
  'updater_ref',
  '_id',
  'node_ref',
  'month_of_year',
  'day_of_month',
  'day_of_week',
  'is_weekend',
  'hour_of_day',
  'ts_ymdh',
  'ts_ymd',
  'ts_ym',
  'word_count',
];

const omitRevertKeys = omitKeys.concat([
  'jwplayer_synced_at',
]);

export const filterRevertableData = (data) => omitBy(data, (value, key) => omitRevertKeys.includes(key));

/**
 * filter out object keys that may not need to display in event stream
 * @param data [object]
 */
export default (data) => omitBy(data, (value, key) => omitKeys.includes(key));
