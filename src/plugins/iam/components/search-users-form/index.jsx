import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';

import LegendSelect from '@triniti/cms/components/legend-select';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import {
  Button,
  Card,
  CardBody,
  Form,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
} from '@triniti/admin-ui-plugin/components';

const { DELETED, PUBLISHED } = NodeStatus;
const statusOptions = [
  { label: 'Is Staff', value: 1 },
  { label: 'Non Staff', value: 2 },
  { label: startCase(DELETED.toString()), value: DELETED.getValue() },
];

const SearchUsersForm = ({
  inputRef,
  isStaff,
  onSubmit,
  q,
  status,
}) => {
  const handleStatusChange = (selectedOption) => {
    const value = selectedOption && selectedOption.value;

    onSubmit({
      is_staff: value === 1 || value === 2 ? value : 0,
      q,
      status: value === DELETED.getValue() ? DELETED.getValue() : PUBLISHED.getValue(),
    });
  };

  const handleSearchTextChange = (e) => onSubmit({
    isStaff,
    q: e.target.value,
    status,
  });

  const selectedValue = statusOptions.find(
    (option) => option.value === (status === DELETED.getValue() ? status : isStaff),
  );
  const handleButtonClick = () => onSubmit({ isStaff, q, status });

  return (
    <Card className="sticky-top">
      <CardBody className="pb-3">
        <div className="pb-3">
          <Form
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <LegendSelect
                  name="status"
                  onChange={handleStatusChange}
                  options={statusOptions}
                  placeholder="Select status:"
                  value={selectedValue}
                />
              </InputGroupAddon>
              <Input
                className="form-control search-nodes__input"
                defaultValue={q}
                innerRef={inputRef}
                name="q"
                onChange={handleSearchTextChange}
                placeholder="Search Users..."
                type="search"
              />
              <InputGroupAddon addonType="append">
                <Button color="secondary" onClick={handleButtonClick}>
                  <Icon imgSrc="search" className="mr-0" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};


SearchUsersForm.propTypes = {
  inputRef: PropTypes.func.isRequired,
  isStaff: PropTypes.oneOf([0, 1, 2]),
  onSubmit: PropTypes.func.isRequired,
  q: PropTypes.string,
  status: PropTypes.string,
};

SearchUsersForm.defaultProps = {
  isStaff: 0,
  q: '',
  status: PUBLISHED.getValue(),
};


export default SearchUsersForm;
