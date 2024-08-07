import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import { useField, useFormContext } from '@triniti/cms/components/index.js';
import defaultLoadOptions from '@triniti/cms/plugins/ncr/components/node-picker-field/loadOptions.js';
import Option from '@triniti/cms/plugins/ncr/components/node-picker-field/Option.js';
import SingleValue from '@triniti/cms/plugins/ncr/components/node-picker-field/SingleValue.js';

const defaultComponents = { Option, SingleValue };

export default function SingleSelectField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    debounceTimeout = 400,
    isClearable = true,
    readOnly = false,
    required = false,
    labelField = 'title',
    showImage = true,
    components = defaultComponents,
    loadOptions = defaultLoadOptions,
    request,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');
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
        labelField={labelField}
        components={components}
        additional={{ page: 1, request }}
        onChange={selected => input.onChange(selected ? selected.value : undefined)}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
