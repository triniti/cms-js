import React, { lazy, Suspense, useRef, useState, useEffect } from 'react';
import startCase from 'lodash-es/startCase';
import useNode from 'plugins/ncr/components/useNode';
import useParams from 'plugins/ncr/components/with-node-screen/useParams';
import { Card, CardBody } from 'reactstrap';
import { Form } from 'react-final-form';
import { ErrorBoundary,  Loading } from 'components';
import { FormSpy } from 'react-final-form';
import { FormContextProvider } from 'components/useFormContext';
import FormMarshaler from 'utils/FormMarshaler';
import arrayMutators from 'final-form-arrays';
import noop from 'lodash/noop';


export { useParams };

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`../asset-screen/${file}Fields`));
  return components[label];
};

const withForm = Component => {
  return props => {
    const propsRef = useRef();
    propsRef.current = props;
    const { pbj, formName } = props;
    const { delegateRef } = props;

    const [initialValues, setInitialValues] = useState();
    useEffect(() => {
      if (delegateRef.current.shouldReinitialize) {
        delegateRef.current.reinitialize = true;
        setInitialValues(FormMarshaler.marshal(pbj, { skipValidation: true }));
      }
    }, [pbj, setInitialValues]);

    if (!initialValues) {
      return <Loading fixed>Loading Form...</Loading>;
    }

    return (
      <FormContextProvider value={{ delegate: delegateRef, formProps: propsRef, pbj }}>
        <Form
          initialValues={initialValues}
          onSubmit={noop}
          mutators={{ ...arrayMutators }}
          delegate={delegateRef.current}
          autoComplete="off"
          render={({ delegate, form, handleSubmit, ...formState }) => {
            // This makes the form look fresh after saved
            useEffect(() => {
              if (delegate.reinitialize) {
                delegate.shouldReinitialize = false;
                delegate.reinitialize = false;
                setTimeout(() => {
                  form.batch(() => {
                    form.setConfig('keepDirtyOnReinitialize', false);
                    form.reset();
                    form.restart();
                    form.setConfig('keepDirtyOnReinitialize', false);
                  });
                  delegate.onAfterReinitialize(pbj);
                  delegate.onAfterReinitialize = noop;
                });
              }
            }, [delegate.reinitialize]);
            return (
              <Component
                form={form}
                handleSubmit={handleSubmit}
                formState={formState}
                delegate={delegate}
                {...props}
              />
            );
          }}
        />
      </FormContextProvider>
    );
  };
}

const withNode = Component => {
  const ComponentWithForm = withForm(Component);
  return props => {
    const config = {};
    const { nodeRef, qname, label } = useParams(props, config);
    const { refreshNodeRef } = props;
    const { node, refreshNode, isRefreshing, setNode, pbjxError } = useNode(nodeRef);
    refreshNodeRef.current = refreshNode;

    if (!node) {
      return <Loading error={pbjxError}>Loading {startCase(label)}...</Loading>;
    }

    return <ComponentWithForm
      {...props}
      formName={nodeRef}
      pbj={node}
      node={node}
      nodeRef={nodeRef}
      qname={qname}
      isRefreshing={isRefreshing}
      refreshNode={refreshNode}
      replaceNode={setNode}
      />
  }
}

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
