import React from 'react';
import PropTypes from 'prop-types';
import { create, formatters } from 'jsondiffpatch/dist/jsondiffpatch.umd.js'; // eslint-disable-line import/extensions

import 'jsondiffpatch/dist/formatters-styles/html.css';
import 'jsondiffpatch/dist/formatters-styles/annotated.css';

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
  'month_of_year',
  'day_of_month',
  'day_of_week',
  'is_weekend',
  'hour_of_day',
  'ts_ymdh',
  'ts_ymd',
  'ts_ym',
];

const jsondiff = create({
  arrays: {
    // default false, the value of items moved is not included in deltas
    includeValueOnMove: true,
  },
  // eslint-disable-next-line no-unused-vars
  propertyFilter: (name, context) => omitKeys.indexOf(name) === -1,
});

/**
 * A wrapper for visual JsonDiffPatch in React
 */
const VisualDiff = ({
  annotated, left, right, showUnchanged, tips,
}) => {
  const delta = jsondiff.diff(left, right);
  const visual = annotated
    ? formatters.annotated.format(delta) : formatters.html.format(delta, left);

  if (!annotated && showUnchanged) {
    formatters.html.showUnchanged();
  } else {
    formatters.html.hideUnchanged();
  }

  return (
    visual
      ? <div dangerouslySetInnerHTML={{ __html: visual }} /> // eslint-disable-line react/no-danger
      : <p style={{ fontSize: 12, color: '#999' }}>{tips}</p>
  );
};

VisualDiff.propTypes = {
  annotated: PropTypes.bool,
  right: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  left: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  showUnchanged: PropTypes.bool,
  tips: PropTypes.string,
};

VisualDiff.defaultProps = {
  annotated: false,
  showUnchanged: false,
  tips: 'no changes',
};

export default VisualDiff;
