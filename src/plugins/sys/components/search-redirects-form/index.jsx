import React from 'react';
import PropTypes from 'prop-types';
import lowerCase from 'lodash/lowerCase';

import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchSortEnum from '@triniti/schemas/triniti/sys/enums/SearchRedirectsSort';
import {
  Button,
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  UncontrolledButtonDropdown,
} from '@triniti/admin-ui-plugin/components';

import BatchOperationDropdown from '@triniti/cms/plugins/ncr/components/batch-operation-dropdown';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import LegendSelect from '@triniti/cms/components/legend-select';

const { DELETED, PUBLISHED } = NodeStatus;
const statusOptions = humanizeEnums(NodeStatus, { format: 'map', only: [DELETED, PUBLISHED] });
const sortOptions = humanizeEnums(SearchSortEnum, {
  format: 'map',
  shouldStartCase: false,
  except: [SearchSortEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label: label.replace(/(asc|desc)/, '$1ending'),
  value,
}));

const SearchRedirectsForm = ({
  currentPage,
  disabled,
  inputRef,
  onUnSelectAllRows,
  onSubmit,
  q,
  schemas,
  selectedRows,
  sort,
  statuses,
}) => {
  const handleStatusChange = (selectedOption) => {
    onSubmit({ q, statuses: !selectedOption ? [] : [selectedOption.value], sort });
    onUnSelectAllRows();
  };

  const handleSearchTextChange = (e) => {
    onSubmit({ q: e.target.value, statuses, sort });
    onUnSelectAllRows();
  };

  const handleSortChange = (newSort) => {
    onSubmit({
      q,
      statuses,
      sort: newSort,
    }, currentPage);
  };

  const handleButtonClick = () => {
    onSubmit({ q, statuses, sort });
    onUnSelectAllRows();
  };

  return (
    <Card className="sticky-top">
      <CardBody className="pb-2">
        <Form
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <LegendSelect
                name="status"
                placeholder="Select status:"
                onChange={handleStatusChange}
                options={statusOptions}
                value={
                    statusOptions.find((option) => option.value === statuses[0])
                  }
              />
            </InputGroupAddon>
            <Input
              className="form-control"
              defaultValue={q}
              disabled={disabled}
              innerRef={inputRef}
              type="search"
              name="q"
              onChange={handleSearchTextChange}
              placeholder="Search Redirects..."
            />
            <InputGroupAddon addonType="append">
              <Button disabled={disabled} color="secondary" onClick={handleButtonClick}>
                <Icon imgSrc="search" className="mr-0" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
        <UncontrolledButtonDropdown className="float-right pt-2">
          <DropdownToggle
            disabled={disabled}
            caret
            size="sm"
            outline
            color="light"
            className="mr-2"
          >
            <Icon imgSrc="services" size="sm" className="mr-1" />
            {lowerCase(sort).replace(/(asc|desc)/, '$1ending')}
          </DropdownToggle>
          <DropdownMenu>
            {sortOptions.map(({ label, value }) => (
              <DropdownItem
                disabled={disabled}
                onClick={() => handleSortChange(value)}
                key={value}
              >
                {label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <BatchOperationDropdown
          className="pt-2"
          nodeRefs={selectedRows}
          schemas={schemas}
          nodeLabel="redirect"
          onUnSelectAllRows={onUnSelectAllRows}
        />
      </CardBody>
    </Card>
  );
};


SearchRedirectsForm.propTypes = {
  currentPage: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func.isRequired,
  onUnSelectAllRows: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  q: PropTypes.string.isRequired,
  schemas: PropTypes.shape({
    deleteNode: PropTypes.object,
    nodeDeleted: PropTypes.object,
    searchNodes: PropTypes.object,
  }).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  sort: PropTypes.string.isRequired,
};

SearchRedirectsForm.defaultProps = {
  disabled: false,
  selectedRows: [],
};

export default SearchRedirectsForm;
