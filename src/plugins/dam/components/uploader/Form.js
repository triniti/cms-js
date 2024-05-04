import React, { lazy, Suspense } from 'react';
import { Card, CardBody } from 'reactstrap';
import startCase from 'lodash-es/startCase.js';
import { ErrorBoundary,  Loading } from '@triniti/cms/components/index.js';
import { FormSpy } from 'react-final-form';
import withNode from '@triniti/cms/plugins/dam/components/uploader/withNode.js';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`../asset-screen/${file}Fields`));
  return components[label];
};


const UploaderForm = props => {
  const {
    form,
    formState,
    onSubmit: handleSubmit,
    node,
    isRefreshing,
    nodeRef,
    label,
    formStateRef,
    currentFormRef,
    currentNodeRef,
    setIsFormDirty,
  } = props;

  // const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const dirty = false;
  const FieldsComponent = resolveComponent(label);
  formStateRef.current = formState;
  currentFormRef.current = form;
  currentNodeRef.current = node;

  return (
    <>
      <Card>
        <CardBody>
          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <FieldsComponent {...props} asset={node}/>
            </ErrorBoundary>
          </Suspense>
        </CardBody>
      </Card>
      <FormSpy>
        {({ dirty }) => { setIsFormDirty(dirty); return null; }}
      </FormSpy>
    </>
  );
}

export default withNode(UploaderForm, {});
