import React from 'react';
import { FormText } from 'reactstrap';
import { useField } from 'react-final-form';
import classNames from 'classnames';
import useFormContext from '@triniti/cms/components/useFormContext';
import validateKey from '@triniti/cms/components/key-values-field/validateKey';

export default function TextKeyField(props) {
  const { groupClassName = '', name, pbjName, ...rest } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField(name, {
    validate: (value, allValues) => validateKey(value, allValues, pbjName),
  });

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const className = classNames(
    'form-control',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  return (
    <div className={rootClassName}>
      <input
        id={name}
        name={name}
        className={className}
        readOnly={!editMode}
        placeholder="Key"
        {...input}
        {...rest}
      />
      {!meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
