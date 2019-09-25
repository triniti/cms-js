import React from 'react';
import { UncontrolledTooltip } from '@triniti/admin-ui-plugin/components';

// maybe set this delay default in admin-ui once we are happy with it
// eslint-disable-next-line react/prop-types
export default ({ children, ...rest }) => (
  <UncontrolledTooltip delay={{ show: 250, hide: 0 }} {...rest}>{children}</UncontrolledTooltip>
);
