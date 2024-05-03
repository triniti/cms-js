import React from 'react';
import {
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

export default (btnInfo, index) => (
  <PaginationItem key={index} {...btnInfo.options}>
    <PaginationLink onClick={() => btnInfo.handleSelectFile(btnInfo.hashName)}>
      {btnInfo.label}
    </PaginationLink>
  </PaginationItem>
);
