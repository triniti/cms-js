import React from 'react';

import OuterErrorBoundary from './outer-error-boundary';
import Blocksmith from './Blocksmith';

export default (props) => (
  <OuterErrorBoundary
    /* eslint-disable-next-line react/destructuring-assignment */
    formName={props.formName}
  >
    <Blocksmith {...props} />
  </OuterErrorBoundary>
);
