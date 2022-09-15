import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ErrorBoundary,  Loading, TextField } from 'components';
import humanizeBytes from 'utils/humanizeBytes';
import TaggableFields from 'plugins/common/components/taggable-fields';
import TranscodeableCard from './TranscodeableCard';
import TranscribeableCard from './TranscribeableCard';

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
  const { label, node, nodeRef } = props;
  const FieldsComponent = resolveComponent(label);
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>{startCase(label).replace(/\s/g, ' ')}</CardHeader>
        <CardBody>
          <TextField name="mime_type" label="MIME type" readOnly />
          <TextField name="file_size" label="File size" format={humanizeBytes} readOnly />
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
