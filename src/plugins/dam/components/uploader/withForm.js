import React, { useRef, useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { FormContextProvider } from 'components/useFormContext';
import FormMarshaler from 'utils/FormMarshaler';
import arrayMutators from 'final-form-arrays';
import noop from 'lodash-es/noop';
import { Loading } from 'components';

export default function withForm(Component) {
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
