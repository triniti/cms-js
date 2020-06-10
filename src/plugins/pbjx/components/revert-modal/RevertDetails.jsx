import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import isPlainObject from 'lodash/isPlainObject';
import RevertPropertiesTable from '../revert-properties-table';
import { filterRevertableData } from '../../utils/filterData';
import findNodeDiff from '../../utils/findNodeDiff';

/**
 * This will keep the whole object or list for a key. The reason is trying
 * to revert specific keys in a block list or multiselect list is difficult
 * because the data might have changed greatly. So we just put it back
 * completely to the original state.
 *
 * @param {Object} newNode
 * @param {Object} origNode
 */
const fullMapsAndLists = (newNode, origNode) => {
  const newerNode = { ...newNode };
  Object.entries(newerNode).forEach((item) => {
    const [key, value] = item;
    if (Array.isArray(value) || isPlainObject(value)) {
      newerNode[key] = origNode[key];
    }
  });
  return newerNode;
};

const RevertDetails = ({ event, isFieldSelected, onSelectField: handleSelectField }) => {
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

  return <RevertPropertiesTable data={fullMapsAndLists(filterRevertableData(diffNode), newNode)} isFieldSelected={isFieldSelected} onSelectField={handleSelectField} />;
};

RevertDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
  isFieldSelected: PropTypes.func.isRequired,
  onSelectField: PropTypes.func.isRequired,
};

export default RevertDetails;
