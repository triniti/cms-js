import PropTypes from 'prop-types';
import React from 'react';
import lowerCase from 'lodash/lowerCase';

import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchSortEnum from '@triniti/schemas/triniti/taxonomy/enums/SearchCategoriesSort';
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

const SearchCategoriesForm = ({
  currentPage,
  disabled,
  inputRef,
  onUnSelectAllRows,
  onSubmit,
  sort,
  statuses,
  request,
}) => {
  const q = request ? request.get('q') : '';

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
        <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
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
              className="form-control search-nodes__input"
              defaultValue={q}
              disabled={disabled}
              innerRef={inputRef}
              type="search"
              name="q"
              onChange={handleSearchTextChange}
              placeholder="Search Categories..."
            />
            <InputGroupAddon addonType="append">
              <Button disabled={disabled} color="secondary" onClick={handleButtonClick}>
                <Icon imgSrc="search" className="mr-0" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <UncontrolledButtonDropdown className="float-right pt-2">
            <DropdownToggle
              disabled={disabled}
              caret
              size="sm"
              outline
              color="light"
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
        </Form>
      </CardBody>
    </Card>
  );
};

SearchCategoriesForm.propTypes = {
  currentPage: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func.isRequired,
  onUnSelectAllRows: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  request: PropTypes.shape({
    get: PropTypes.func,
    q: PropTypes.string,
    sort: PropTypes.string,
    statuses: PropTypes.array,
    created_after: PropTypes.instanceOf(Date),
    created_before: PropTypes.instanceOf(Date),
    updated_after: PropTypes.instanceOf(Date),
    updated_before: PropTypes.instanceOf(Date),
    category_refs: PropTypes.arrayOf(String),
    channel_ref: PropTypes.arrayOf(String),
    person_refs: PropTypes.arrayOf(String),
    count: PropTypes.number,
  }),
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  sort: PropTypes.string.isRequired,
};

SearchCategoriesForm.defaultProps = {
  disabled: false,
  request: {},
};

export default SearchCategoriesForm;
