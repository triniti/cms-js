import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import RevertPropertiesTable from '../revert-properties-table';
import { filterRevertableData } from '../../utils/filterData';
import findNodeDiff from '../../utils/findNodeDiff';
import fullMapsAndLists from '../../utils/fullMapsAndLists';

const RevertDetails = ({ event, isFieldSelected, isDbValueSameAsNodeValue, onSelectField: handleSelectField }) => {
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
      isFieldSelected={isFieldSelected}
      onSelectField={handleSelectField}
    />
  );
};

RevertDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
  isDbValueSameAsNodeValue: PropTypes.func.isRequired,
  isFieldSelected: PropTypes.func.isRequired,
  onSelectField: PropTypes.func.isRequired,
};

export default RevertDetails;
