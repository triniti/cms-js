import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase.js';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`@triniti/cms/plugins/dam/components/asset-screen/${file}Fields.js`));
  return components[label];
};

export default function DetailsTab(props) {
  const { label } = props;
  const FieldsComponent = resolveComponent(label);

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <FieldsComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
