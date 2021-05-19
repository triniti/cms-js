import React from 'react';

import Blocksmith from './Blocksmith';
import OuterErrorBoundary from './outer-error-boundary';

export default (props) => (
  <OuterErrorBoundary
    /* eslint-disable-next-line react/destructuring-assignment */
    formName={props.formName}
  >
    <Blocksmith {...props} />
  </OuterErrorBoundary>
);
