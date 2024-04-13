import React from 'react';
import {
  Button,
  Input,
  InputGroup,
} from 'reactstrap';
import Icon from '@triniti/cms/components/icon';

export default function SearchBar({
  innerRef, onChangeQ: handleChangeQ, onClick: handleSearch, placeholder, value,
}) {
  return (
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
        <Button color="secondary" onClick={() => handleSearch()}>
          <Icon imgSrc="search" className="me-0" />
        </Button>
      </InputGroup>
    </div>
  );
};
