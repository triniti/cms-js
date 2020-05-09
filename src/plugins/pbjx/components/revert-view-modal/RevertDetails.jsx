import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import RevertPropertiesTable from '../revert-properties-table';
import filterData from '../../utils/filterData';
import findNodeDiff from '../../utils/findNodeDiff';

const RevertDetails = ({ event, onChangeCheckbox: handleChangeCheckbox }) => {
  const schema = event.schema();

  if (schema.hasMixin('gdbots:ncr:mixin:node-updated')) {
    if (event.get('new_etag') === event.get('old_etag')) {
      return <div key="a"><strong className="text-black-50 pl-2 pr-2">No Changes</strong></div>;
    }

    // find properties in node that were removed
    const oldNodeKeys = Object.keys(event.get('old_node').toObject());
    const newNodeKeys = Object.keys(event.get('new_node').toObject());
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));
    const newNode = event.get('new_node').toObject();

    missingKeys.forEach((key) => {
      newNode[key] = null;
    });

    const diffNode = findNodeDiff(filterData(newNode), filterData(event.get('old_node').toObject()));

    return <RevertPropertiesTable data={filterData(diffNode)} onChangeCheckbox={handleChangeCheckbox} />;
  }
  if (schema.hasMixin('gdbots:iam:mixin:user-roles-granted') || schema.hasMixin('gdbots:iam:mixin:user-roles-revoked')) {
    return event.get('roles').map((nodeRef) => <div key={nodeRef}><strong className="text-black-50 pl-2 pr-2">{nodeRef.id}</strong></div>);
  }
  if (schema.hasMixin('gdbots:ncr:mixin:node-created')) {
    return <RevertPropertiesTable data={filterData(event.get('node').toObject())} onChangeCheckbox={handleChangeCheckbox} />;
  }
  return <RevertPropertiesTable data={filterData(event.toObject())} onChangeCheckbox={handleChangeCheckbox} />;
};

RevertDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
  onChangeCheckbox: PropTypes.func.isRequired,
};

export default RevertDetails;
