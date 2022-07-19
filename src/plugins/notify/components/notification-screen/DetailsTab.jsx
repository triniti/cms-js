import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import { ErrorBoundary, Loading } from 'components';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`./${file}Fields`));
  return components[label];
};

export default function DetailsTab(props) {
  const { label } = props;
  const FieldsComponent = resolveComponent(label);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <FieldsComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
