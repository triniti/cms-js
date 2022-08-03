import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import fastDeepEqual from 'fast-deep-equal/es6';
import isEmpty from 'lodash-es/isEmpty';
import { useField, useFormContext } from 'components/index';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));
const noopNormalize = value => value;

export default function MultiSelectField(props) {
  const {
    className = '',
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
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

  const [allOptions, setAllOptions] = useState(options);

  useEffect(() => {
    if (!input.value.length) {
      return;
    }

    const initialOptions = options.map(o => normalize(o.value));
    const newOptions = [
      ...options,
      ...input.value
        .filter(v => !initialOptions.includes(normalize(v)))
        .map(v => ({ value: normalize(v), label: v }))
    ];

    setAllOptions(newOptions);
  }, [input.value]);

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

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
