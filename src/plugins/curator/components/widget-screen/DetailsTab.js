import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ErrorBoundary, Loading, TextField } from '@triniti/cms/components/index.js';
import TaggableFields from 'plugins/common/components/taggable-fields';

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
      <Card>
        <CardHeader>Options</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <FieldsComponent {...props} />
            </ErrorBoundary>
          </Suspense>
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}
