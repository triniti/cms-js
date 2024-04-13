import React from 'react';
import startCase from 'lodash-es/startCase';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { EnumField } from '@triniti/cms/components';
import Option from '@triniti/cms/plugins/ncr/components/node-status-field/Option';
import SingleValue from '@triniti/cms/plugins/ncr/components/node-status-field/SingleValue';

const expirableOptions = {
  published: true,
  expired: true,
  archived: true,
  deleted: true,
};

const minimalOptions = {
  published: true,
  deleted: true,
};

const filters = {
  all: option => option.value !== 'unknown',
  expirable: option => !!expirableOptions[option.value],
  minimal: option => !!minimalOptions[option.value],
};

const format = label => startCase(label.toLowerCase());

const components = { Option, SingleValue };

export default function NodeStatusField(props) {
  const { preset = 'all' } = props;

  return <EnumField
    enumClass={NodeStatus}
    cacheKey={preset}
    filter={filters[preset] || filters.all}
    format={format}
    name="status"
    placeholder="Select Status:"
    components={components}
    {...props}
  />;
}
