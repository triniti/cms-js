import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import { useField, useFormContext } from 'components/index';

export default function SingleSelectField(props) {
  const {
    className = '',
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
    options = [],
    allowOther = false,
    ignoreUnknownOptions = false,
    isClearable = true,
    readOnly = false,
    required = false,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);
  const [allOptions, setAllOptions] = useState(options);

  useEffect(() => {
    if (ignoreUnknownOptions || !`${input.value}`.length) {
      return;
    }

    if (options.map(o => `${o.value}`).includes(`${input.value}`)) {
      return;
    }

    setAllOptions([...options, { value: input.value, label: input.value }]);
  }, []);

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

  const currentOption = `${input.value}`.length ? allOptions.find(o => `${o.value}` === `${input.value}`) : null;
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
        isMulti={false}
        options={allOptions}
        value={currentOption}
        onChange={selected => input.onChange(selected ? selected.value : undefined)}
        onCreateOption={value => {
          const newOption = { value, label: value };
          setAllOptions([...allOptions, newOption]);
          input.onChange(value);
        }}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
