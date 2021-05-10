import React from 'react';

// eslint-disable-next-line import/no-named-as-default
import OuterErrorBoundary from '@triniti/cms/plugins/blocksmith/components/outer-error-boundary';

import Blocksmith from './Blocksmith';

export default ({ ...rest }) => (
  <OuterErrorBoundary
    formName={rest.formName}
  >
    <Blocksmith {...rest} />
  </OuterErrorBoundary>
);
