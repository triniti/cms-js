import React from 'react';
import {
  PaginationItem,
  PaginationLink,
} from '@triniti/admin-ui-plugin/components';

export default (btnInfo, index) => (
  <PaginationItem key={index} {...btnInfo.options}>
    <PaginationLink onClick={() => btnInfo.handleSelectFile(btnInfo.hashName)}>
      {btnInfo.label}
    </PaginationLink>
  </PaginationItem>
);
