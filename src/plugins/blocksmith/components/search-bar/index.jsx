import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
} from '@triniti/admin-ui-plugin/components';

const SearchBar = ({
  innerRef, onChangeQ: handleChangeQ, onClick: handleSearch, placeholder, value,
}) => (
  <div className="sticky-top px-4 py-2 shadow-depth-2 bg-white" style={{ marginBottom: '1px' }}>
    <InputGroup size="sm">
      <Input
        autoFocus
        className="form-control"
        innerRef={innerRef}
        onChange={handleChangeQ}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      <InputGroupAddon addonType="append">
        <Button color="secondary" onClick={() => handleSearch()}>
          <Icon imgSrc="search" className="mr-0" />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  </div>
);

SearchBar.propTypes = {
  innerRef: PropTypes.func,
  onChangeQ: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

SearchBar.defaultProps = {
  innerRef: noop,
};

export default SearchBar;
