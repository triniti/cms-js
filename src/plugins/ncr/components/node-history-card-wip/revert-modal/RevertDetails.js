import React from 'react';
import RevertPropertiesTable from 'src/plugins/ncr/components/node-history-card-wip/revert-properties-table/index.js';
import filterRevertableData from 'src/plugins/ncr/components/node-history-card-wip/filterData.js';
import findNodeDiff from 'src/plugins/ncr/components/node-history-card-wip/findNodeDiff.js';
import fullMapsAndLists from 'src/plugins/ncr/components/node-history-card-wip/fullMapsAndLists.js';

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
