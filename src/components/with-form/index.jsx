import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import registerForm from '@triniti/cms/actions/registerForm.js';
import unregisterForm from '@triniti/cms/actions/unregisterForm.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import { FormContextProvider } from '@triniti/cms/components/useFormContext.js';
import Loading from '@triniti/cms/components/loading/index.jsx';
import noop from 'lodash-es/noop.js';

const defaultHandleSubmit = values => console.info('defaultHandleSubmit', values);

export default function withForm(Component, config = {}) {
  config.restorable = !!config.restorable;
  config.keepDirtyOnReinitialize = !!config.keepDirtyOnReinitialize;

  return function ComponentWithForm(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const propsRef = useRef();
    propsRef.current = props;
    const { pbj, formName } = props;

    const delegateRef = useRef({
      defaultHandleSubmit,
      handleSubmit: defaultHandleSubmit,
      onAfterReinitialize: noop,
      shouldReinitialize: true,
      reinitialize: false,
    });

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
      <FormContextProvider value={{ delegate: delegateRef, formProps: propsRef, pbj, config }}>
        <Form
          initialValues={initialValues}
          onSubmit={(values, form) => (
            delegateRef.current.handleSubmit(values, form)
          )}
          mutators={{ ...arrayMutators }}
          delegate={delegateRef.current}
          render={({ delegate, form, handleSubmit, ...formState }) => {
            useEffect(() => {
              if (delegate.reinitialize) {
                delegate.shouldReinitialize = false;
                delegate.reinitialize = false;
                setTimeout(() => {
                  form.batch(() => {
                    form.setConfig('keepDirtyOnReinitialize', false);
                    form.reset();
                    form.restart();
                    form.setConfig('keepDirtyOnReinitialize', config.keepDirtyOnReinitialize);
                  });
                  delegate.onAfterReinitialize(pbj);
                  delegate.onAfterReinitialize = noop;
                });
              }
            }, [delegate.reinitialize]);

            useEffect(() => {
              if (!config.restorable) {
                return noop;
              }

              dispatch(registerForm({
                name: formName,
                config,
                delegate,
                props: propsRef,
                form,
                navigate,
              }));

              // fixme: finish up this save dirty form when leaving page so we can restore it on mount again.
              // only save dirty fields to sessionStorage
              // add delegate.handleRestore to use the local storage when present?
              return () => {
                const state = form.getState();
                if (state.dirty) {
                  window.sessionStorage.setItem(`form.${formName}`, JSON.stringify(state.values));
                } else {
                  window.sessionStorage.removeItem(`form.${formName}`);
                }

                dispatch(unregisterForm(formName));
              };
            }, []);

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
