import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import useDelegate from 'plugins/ncr/components/with-node-screen/useDelegate';
import useParams from 'plugins/ncr/components/with-node-screen/useParams';
import PropTypes from 'prop-types';
import withNodeScreen from 'plugins/ncr/components/with-node-screen';
import { Form, Card, CardBody } from 'reactstrap';
import { ErrorBoundary,  Loading } from 'components';
import { FormSpy } from 'react-final-form';


export { useDelegate, useParams };

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
    editMode,
    node,
    isRefreshing,
    qname,
    nodeRef,
    policy,
    tab,
    urls,
    label,
    uploaderFormState,
    uploaderCurrentForm,
    uploaderCurrentNode,
    setIsFormDirty,
  } = props;

  window.f = form;
  const delegate = useDelegate(props);

  const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);
  const FieldsComponent = resolveComponent(label);
  uploaderFormState.current = formState;
  uploaderCurrentForm.current = form;
  uploaderCurrentNode.current = node;

  return (
    <>
      {/* {dirty && hasValidationErrors && <FormErrors errors={errors} />} */}
      <Form onSubmit={handleSubmit} autoComplete="off">
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
      </Form>
    </>
  );
}

// export default withForm(UploaderForm);
export default withNodeScreen(UploaderForm, {});
