import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import DatePickerField from '@triniti/cms/components/date-picker-field';
import NumberField from '@triniti/cms/components/number-field';

import {
  Button,
  CardBody,
  CardHeader,
  Collapse,
  Card,
  InputGroup,
} from '@triniti/admin-ui-plugin/components';

const AdvancedOptionFields = ({
  onSearch,
  onReset,
  onChangeDate,
  onChangeCount,
  request,
  onToggleCollapse,
  isCollapsed,
}) => {
  const {
    count,
    created_after: createdAfter,
    created_before: createdBefore,
    published_after: publishedAfter,
    published_before: publishedBefore,
    updated_after: updatedAfter,
    updated_before: updatedBefore,
  } = request;

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
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeCount: PropTypes.func.isRequired,
  request: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onToggleCollapse: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
};

AdvancedOptionFields.defaultProps = {
  request: null,
  isCollapsed: true,
};

export default AdvancedOptionFields;
