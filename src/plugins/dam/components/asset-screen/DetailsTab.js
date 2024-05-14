import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase.js';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ErrorBoundary,  Loading } from '@triniti/cms/components/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import TranscodeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscodeableCard.js';
import TranscribeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscribeableCard.js';

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
  const { label, node, nodeRef } = props;
  const FieldsComponent = resolveComponent(label);
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>{startCase(label).replace(/\s/g, ' ')}</CardHeader>
        <CardBody>
          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <FieldsComponent {...props} asset={node}/>
            </ErrorBoundary>
          </Suspense>
        </CardBody>
      </Card>
      {schema.hasMixin('triniti:ovp:mixin:transcodeable') && (
       <TranscodeableCard asset={node} />
      )}
      {schema.hasMixin('triniti:ovp:mixin:transcribable') && (
       <TranscribeableCard asset={node} />
      )}
      {schema.hasMixin('gdbots:common:mixin:taggable') && (
       <TaggableFields />
      )}
    </>
  );
}