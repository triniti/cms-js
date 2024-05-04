import React from 'react';
import { Loading, SelectField } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

const defaults = new Map;
const picklists = new Map;

export default function PicklistField({ picklist, ...rest }) {
  const nodeRef = `${APP_VENDOR}:picklist:${picklist}`;
  const { node, pbjxError } = useNode(nodeRef, false);

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return <Loading inline size="sm" error={error}>Loading picklist {picklist}...</Loading>;
  }

  const allowOther = node.get('allow_other');

  if (!picklists.has(picklist)) {
    const options = node.get('options', []);
    const defaultValue = node.get('default_value') || undefined;
    defaults.set(picklist, defaultValue);

    if (node.has('default_value') && !options.includes(defaultValue)) {
      options.unshift(defaultValue);
    }

    if (node.get('alpha_sort')) {
      options.sort();
    }

    picklists.set(picklist, options.map(o => ({ value: o, label: o })));
  }

  return <SelectField
    {...rest}
    options={picklists.get(picklist)}
    defaultValue={defaults.get(picklist)}
    allowOther={allowOther}
    ignoreUnknownOptions={!allowOther}
  />;
}
