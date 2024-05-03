import React from 'react';
import RevertPropertiesTable from '../revert-properties-table/index.js';
import filterRevertableData from '@triniti/cms/plugins/ncr/components/node-history-card/filterData.js';
import findNodeDiff from '@triniti/cms/plugins/ncr/components/node-history-card/findNodeDiff.js';
import fullMapsAndLists from '@triniti/cms/plugins/ncr/components/node-history-card/fullMapsAndLists.js';

const RevertDetails = ({ event, isDbValueSameAsNodeValue, onSelectField: handleSelectField }) => {
  // find properties in node that were removed
  const newNode = event.get('new_node').toObject();
  const oldNode = event.get('old_node').toObject();
  const newNodeKeys = Object.keys(newNode);
  const oldNodeKeys = Object.keys(oldNode);
  const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));

  missingKeys.forEach((key) => {
    newNode[key] = null;
  });

  const diffNode = findNodeDiff(filterRevertableData(newNode), filterRevertableData(oldNode));
  const data = fullMapsAndLists(filterRevertableData(diffNode), newNode);

  return (
    <RevertPropertiesTable
      data={data}
      node={event.get('new_node')}
      isDbValueSameAsNodeValue={isDbValueSameAsNodeValue}
      onSelectField={handleSelectField}
    />
  );
};

export default RevertDetails;
