import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import isArray from 'lodash-es/isArray.js';
import isEmpty from 'lodash-es/isEmpty.js';
import { useField, useFormContext } from '@triniti/cms/components/index.js';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));
const noopNormalize = value => value;

export default function MultiSelectField(props) {
  const {
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    className = '',
    groupClassName = '',
    options = [],
    allowOther = false,
    closeMenuOnSelect = false,
    isClearable = false,
    readOnly = false,
    required = false,
    normalize = noopNormalize,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props, isEqual }, formContext);

  const [originalOptions, setOriginalOptions] = useState(options);
  const [allOptions, setAllOptions] = useState(null);

  useEffect(() => {
    // todo: must be a better way to have dynamic options, this is gross.
    if (JSON.stringify(options) === JSON.stringify(originalOptions)) {
      return;
    }

    setOriginalOptions(options);
  }, [options]);

  useEffect(() => {
    if (!input.value || !input.value.length) {
      setAllOptions(originalOptions);
      return;
    }

    const inputValue = isArray(input.value) ? input.value : [input.value];
    const initialOptions = originalOptions.map(o => normalize(o.value));
    const newOptions = [
      ...originalOptions,
      ...inputValue
        .filter(v => !initialOptions.includes(normalize(v)))
        .map(v => ({ value: normalize(v), label: v }))
    ];

    setAllOptions(newOptions);
  }, [input.value, originalOptions]);

  if (allOptions === null) {
    return null;
  }

  const rootClassName = classNames(groupClassName, 'form-group');
  const classes = classNames(
    'select',
    className,
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentOptions = input.value.length ? allOptions.filter(o => input.value.includes(o.value)) : null;
  const Select = allowOther ? ReactSelectCreatable : ReactSelect;

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <Select
        {...input}
        {...rest}
        id={name}
        name={name}
        className={classes}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={isClearable}
        closeMenuOnSelect={closeMenuOnSelect}
        isMulti
        options={allOptions}
        value={currentOptions}
        onChange={selected => input.onChange(selected ? selected.map(o => o.value) : undefined)}
        onCreateOption={value => {
          const newOption = { value: normalize(value), label: value };
          setAllOptions([...allOptions, newOption]);
          input.onChange([...(input.value || []), normalize(value)]);
        }}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
