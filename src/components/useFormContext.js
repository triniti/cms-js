import { createContext, useContext } from 'react';
import { useForm } from 'react-final-form';

const FormContext = createContext(undefined);
export const FormContextProvider = FormContext.Provider;

export default () => {
  const context = useContext(FormContext);
  const form = useForm();

  const formProps = context.formProps.current;
  const { editMode = true, nodeRef, qname } = formProps;

  return {
    config: context.config,
    formName: formProps.formName,
    formProps,
    form,
    pbj: context.pbj,
    delegate: context.delegate.current,
    editMode,
    nodeRef,
    qname,
  };
};
