import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import noop from 'lodash/noop';
import NumberField from '@triniti/cms/components/number-field';
import PeoplePickerField from '@triniti/cms/plugins/people/components/people-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';
import {
  Button,
  CardBody,
  CardHeader,
  Collapse,
  Card,
  InputGroup,
} from '@triniti/admin-ui-plugin/components';

const AdvancedOptionFields = ({
  isCollapsed,
  onChangeCount,
  onChangeDate,
  onChangeSelect,
  onClearSelect,
  onRemoveFromSelect,
  onReset,
  onSearch,
  onToggleCollapse,
  request,
}) => {
  const {
    category_refs: categoryRefs,
    channel_ref: channelRef,
    count,
    created_after: createdAfter,
    created_before: createdBefore,
    person_refs: personRefs,
    published_after: publishedAfter,
    published_before: publishedBefore,
    timeline_ref: timelineRef,
    updated_after: updatedAfter,
    updated_before: updatedBefore,
  } = request;

  const getAll = (key) => {
    const refs = request[key];
    if (!refs) {
      return [];
    }
    return (Array.isArray(refs) ? refs : [refs]).map(NodeRef.fromString);
  };

  return (
    <Card className="advanced-options">
      <CardHeader toggler>
        <Button color="toggler" onClick={onToggleCollapse} active={!isCollapsed}> Advanced Options</Button>
      </CardHeader>
      <Collapse isOpen={!isCollapsed}>
        <CardBody>
          <InputGroup className="advanced-options__items">
            <DatePickerField
              input={{
                name: 'createdAfter',
                onChange: (date) => {
                  onChangeDate('created_after', date);
                },
                value: createdAfter || null,
              }}
              label="Created After"
              meta={{ error: '' }}
              showSetCurrentDateTimeIcon={false}
            />

            <DatePickerField
              input={{
                name: 'createdBefore',
                onChange: (date) => onChangeDate('created_before', date),
                value: createdBefore || null,
              }}
              label="Created Before"
              meta={{ error: '' }}
              showSetCurrentDateTimeIcon={false}
            />

            <DatePickerField
              input={{
                name: 'updatedAfter',
                onChange: (date) => onChangeDate('updated_after', date),
                value: updatedAfter || null,
              }}
              label="Updated After"
              meta={{ error: '' }}
              showSetCurrentDateTimeIcon={false}
            />

            <DatePickerField
              input={{
                name: 'updatedBefore',
                onChange: (date) => onChangeDate('updated_before', date),
                value: updatedBefore || null,
              }}
              label="Updated Before"
              meta={{ error: '' }}
              showSetCurrentDateTimeIcon={false}
            />

            <DatePickerField
              input={{
                name: 'publishedAfter',
                onChange: (date) => onChangeDate('published_after', date),
                value: publishedAfter || null,
              }}
              label="Published After"
              meta={{ error: '' }}
              showSetCurrentDateTimeIcon={false}
            />

            <DatePickerField
              input={{
                name: 'publishedBefore',
                onChange: (date) => onChangeDate('published_before', date),
                value: publishedBefore || null,
              }}
              label="Published Before"
              meta={{ error: '' }}
              showSetCurrentDateTimeIcon={false}
            />

            <CategoryPickerField
              disabled={false}
              fields={{
                getAll: () => getAll('category_refs'),
                push: (nodeRef) => onChangeSelect('category_refs', nodeRef.toString()),
                removeAll: () => onClearSelect('category_refs'),
                remove: (index) => onRemoveFromSelect('category_refs', categoryRefs[index]),
              }}
              isEditMode
              label="Categories"
              placeholder="Select Categories..."
            />

            <ChannelPickerField
              fields={{
                getAll: () => getAll('channel_ref'),
                push: (nodeRef) => onChangeSelect('channel_ref', nodeRef.toString(), false),
                removeAll: () => onClearSelect('channel_ref'),
                remove: () => onRemoveFromSelect('channel_ref', channelRef),
              }}
              isEditMode
              label="Channels"
            />

            <PeoplePickerField
              fields={{
                getAll: () => getAll('person_refs'),
                push: (nodeRef) => onChangeSelect('person_refs', nodeRef.toString()),
                removeAll: () => onClearSelect('person_refs'),
                remove: (index) => onRemoveFromSelect('person_refs', personRefs[index]),
              }}
              isEditMode
              label="Related People"
            />

            <TimelinePickerField
              fields={{
                getAll: () => getAll('timeline_ref'),
                push: (nodeRef) => onChangeSelect('timeline_ref', nodeRef.toString(), false),
                removeAll: () => onClearSelect('timeline_ref'),
                remove: () => onRemoveFromSelect('timeline_ref', timelineRef),
              }}
              isEditMode
              label="Timelines"
              isMulti={false}
            />

            <NumberField
              input={{
                onChange: onChangeCount,
                onBlur: noop,
                name: 'count',
              }}
              label="Count"
              meta={{ error: '' }}
              value={count || 25}
            />
          </InputGroup>

          <div className="advanced-options__nav pb-3">
            <Button onClick={onReset} color="secondary" disabled={false}> Clear </Button>
            <Button onClick={onSearch} color="primary" disabled={false} className="mr-1 align-right"> Search </Button>
          </div>
        </CardBody>
      </Collapse>
    </Card>
  );
};

AdvancedOptionFields.propTypes = {
  onChangeCount: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeSelect: PropTypes.func.isRequired,
  onClearSelect: PropTypes.func.isRequired,
  onRemoveFromSelect: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  request: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onToggleCollapse: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
};

AdvancedOptionFields.defaultProps = {
  request: null,
  isCollapsed: true,
};

export default AdvancedOptionFields;
