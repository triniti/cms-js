import React from 'react';

import Blocksmith from './Blocksmith';
import OuterErrorBoundary from './error-boundary/OuterErrorBoundary';

export default ({ ...rest }) => (
  <OuterErrorBoundary>
    <Blocksmith {...rest} />
  </OuterErrorBoundary>
);
