import React from 'react';

import OuterErrorBoundary from './outer-error-boundary';
import Blocksmith from './Blocksmith';

export default ({ ...rest }) => (
  <OuterErrorBoundary
    formName={rest.formName}
  >
    <Blocksmith {...rest} />
  </OuterErrorBoundary>
);
