import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import { useField, useFormContext } from 'components';
import defaultLoadOptions from 'plugins/ncr/components/node-picker-field/loadOptions';
import Option from 'plugins/ncr/components/node-picker-field/Option';
import SingleValue from 'plugins/ncr/components/node-picker-field/SingleValue';

const defaultComponents = { Option, SingleValue };

export default function SingleSelectField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
    debounceTimeout = 400,
    isClearable = true,
    readOnly = false,
    required = false,
    showImage = true,
    components = defaultComponents,
    loadOptions = defaultLoadOptions,
    request,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const className = classNames(
    'select',
    showImage && 'select-with-image',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentOption = `${input.value}`.length ? { value: input.value, label: input.value } : null;

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <AsyncPaginate
        {...input}
        {...rest}
        id={name}
        name={name}
        className={className}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={isClearable}
        isMulti={false}
        hideSelectedOptions={false}
        value={currentOption}
        debounceTimeout={debounceTimeout}
        loadOptions={loadOptions}
        showImage={showImage}
        components={components}
        additional={{ page: 1, request }}
        onChange={selected => input.onChange(selected ? selected.value : undefined)}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
