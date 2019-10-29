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
  { label: 'Is Staff', value: 1, category: 'type' },
  { label: 'Non Staff', value: 2, category: 'type' },
  { label: startCase(DELETED), value: DELETED.toString(), category: 'status' },
];

const SearchUsersForm = ({
  inputRef,
  isStaff,
  onSubmit,
  q,
  userStatus,
}) => {
  const handleStatusChange = (selectedOption) => onSubmit({
    is_staff: (selectedOption && selectedOption.category === 'type') ? selectedOption.value : 0,
    q,
    status: (selectedOption && selectedOption.category === 'status') ? selectedOption.value : PUBLISHED.toString(),
  });

  const handleSearchTextChange = (e) => onSubmit({
    isStaff,
    q: e.target.value,
    status: userStatus,
  });

  const value = statusOptions
    .find((option) => option.value === (userStatus === DELETED.toString() ? userStatus : isStaff));

  const handleButtonClick = () => onSubmit({ isStaff, q, status: userStatus });

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
                  placeholder="Select status:"
                  onChange={handleStatusChange}
                  options={statusOptions}
                  value={value}
                />
              </InputGroupAddon>
              <Input
                className="form-control search-nodes__input"
                innerRef={inputRef}
                name="q"
                onChange={handleSearchTextChange}
                placeholder="Search Users..."
                type="search"
                defaultValue={q}
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
  userStatus: PropTypes.string.isRequired,
};

SearchUsersForm.defaultProps = {
  isStaff: 0,
  q: '',
};


export default SearchUsersForm;
